import Input from "./Input";
import Messages from "./Messages";
import styles from "./style.module.scss";
import TopChatList from "./TopChatList";
import classNames from "classnames";
import useMessagesAPI from "../../../hooks/api/useMessagesAPI";
import usePrompt from "../../../hooks/usePrompt";
import searchFileIcon from "../../../assets/icons/search-files.png";

import { stopStreaming } from "../../../redux/chat/chatSlice";
import { arrayUniqueByKey } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment-question.svg";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import PinnedMessages from "./PinnedMessages";
import { chatModes } from "../../../hooks/useMessages";
import SelectedMessages from "./SelectedMessages";
import toast from "react-hot-toast";
import { useMsal } from "@azure/msal-react";

const EmptyMessages = ({ hasChats, hasIntegrations, isChat }) => (
  <div
    className={classNames(styles.emptyMessages, {
      [styles.hasChats]: hasChats,
      [styles.hasIntegrations]: hasIntegrations
    })}
  >
    {isChat ? (
      <CommentIcon />
    ) : (
      <img src={searchFileIcon} width={150} height={150} />
    )}
    <h3>{!isChat ? "Search Files" : "Ask a question!"}</h3>
    <p>
      {isChat
        ? "Effective questioning involves more than just forming inquiries; itrequires a thoughtful approach."
        : "Ask me where your files are at and extract document contents and summaries."}
    </p>
  </div>
);

const Chatting = ({
  chats,
  integrations,
  activeChat,
  activeIntegration,
  onCloseIntegration,
  handleSelectChat,
  handleSelectIntegration,
  isChat,
  chatId,
  refetch,
  setRelatedFiles,
  isAudit
}) => {
  const listRef = createRef();
  const dispatch = useDispatch();

  const { accounts } = useMsal();

  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );

  const {
    data,
    refetch: refetchMessages,
    isLoading,
    deleteMutation
  } = useMessagesAPI({ chatId });

  const { startPrompting, questions, files } = usePrompt({
    chatId,
    refetchMessages,
    listRef,
    setRelatedFiles
  });

  const [text, setText] = useState("");
  const [mode, setMode] = useState(chatModes);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const pinnedMessages = useMemo(() => {
    if (!data || !data.lists) return [];

    return data.lists.filter((message) => message.pinned);
  }, [data]);

  const clearAllSelectedMessages = () => {
    setSelectedMessages([]);
  };

  const deleteAllSelectedMessages = () => {
    deleteMutation.mutate(
      {
        chatId,
        body: [...selectedMessages]
      },
      {
        onSuccess: () => {
          refetchMessages();
          setSelectedMessages([]);
        },
        onError: (err) => {
          toast.error(err.data?.title);
        }
      }
    );
  };

  const toggleMessage = (messageId) => {
    if (selectedMessages.includes(messageId))
      setSelectedMessages((prev) =>
        prev.filter((msgId) => msgId !== messageId)
      );
    else setSelectedMessages((prev) => [...prev, messageId]);
  };

  const disabled = useMemo(() => !text, [text]);

  useEffect(() => {
    if (selectedMessages.length === 0) return setMode(chatModes.CHAT);

    return setMode(chatModes.SELECT);
  }, [selectedMessages]);

  useEffect(() => {
    if (isChat || !data || !data.lists) return;

    const _files = [];

    data.lists
      ?.filter((message) => message.searchFiles?.length > 0)
      ?.forEach((message) =>
        message.searchFiles?.map((file) => _files.push(file))
      );

    setRelatedFiles((prev) => arrayUniqueByKey([...prev, ..._files]));
  }, [data]);

  const onTexting = (e) => {
    setText(e.target.value);
  };

  const onSend = useCallback(
    (e) => {
      e.preventDefault();
      setText("");

      if (textGenerator?.isStreaming) dispatch(stopStreaming({ chatId }));
      else startPrompting(text);
    },
    [textGenerator, text, chatId]
  );

  const handleCopySelectedMessages = async () => {
    let copyMarkdown = "";
    data?.lists?.forEach((message) => {
      if (selectedMessages.includes(message.id)) {
        copyMarkdown += `– ${
          message.role === "Assistant"
            ? "Datox Copilot"
            : "User: " + accounts?.[0]?.name
        }\nMessage: ${message.text}\n\n`;
      }
    });

    await navigator.clipboard.writeText(copyMarkdown);

    toast.success("Copied!");
  };

  const onSelectQuestion = (question) => {
    startPrompting(question);
  };

  return (
    <div className={styles.chattingContainer}>
      {!isChat && !isAudit && (
        <TopChatList
          chats={chats}
          integrations={integrations}
          activeChat={activeChat}
          activeIntegration={activeIntegration}
          handleSelectChat={handleSelectChat}
          handleSelectIntegration={handleSelectIntegration}
          onCloseIntegration={onCloseIntegration}
          refetch={refetch}
        />
      )}

      {!isAudit && (
        <>
          <SelectedMessages
            selectedMessages={selectedMessages}
            onCancel={clearAllSelectedMessages}
            onDelete={deleteAllSelectedMessages}
            onCopy={handleCopySelectedMessages}
            isLoading={deleteMutation.isLoading}
          />

          <PinnedMessages
            pinnedMessages={pinnedMessages}
            chatId={chatId}
            refetch={refetchMessages}
          />
        </>
      )}
      <div className={styles.chatting}>
        <div
          className={classNames(styles.messages, {
            [styles.hasChats]: !isChat && !isAudit,
            [styles.hasIntegrations]: !isChat && !isAudit,
            [styles.hasPinnedMessages]: pinnedMessages?.length > 0 && !isAudit,
            [styles.hasSelectedMessages]:
              selectedMessages.length > 0 && !isAudit,
            [styles.isAudit]: isAudit
          })}
        >
          {data?.lists?.length > 0 || isLoading ? (
            <Messages
              ref={listRef}
              data={data}
              mode={mode}
              files={files}
              isAudit={isAudit}
              chatId={chatId}
              refetch={refetch}
              isLoading={isLoading}
              questions={questions}
              activeChat={activeChat}
              selectedMessages={selectedMessages}
              isStreaming={textGenerator?.isStreaming}
              toggleMessage={toggleMessage}
              refetchMessages={refetchMessages}
              onSelectQuestion={onSelectQuestion}
            />
          ) : (
            <EmptyMessages
              hasChats={chats?.length > 0 || !isChat}
              hasIntegrations={integrations?.length > 0}
              isChat={isChat}
            />
          )}
        </div>
        {chatId && !isAudit && (
          <Input
            text={text}
            disabled={disabled}
            onTexting={onTexting}
            onSend={onSend}
            isStreaming={textGenerator?.isStreaming}
          />
        )}
      </div>
    </div>
  );
};

export default Chatting;
