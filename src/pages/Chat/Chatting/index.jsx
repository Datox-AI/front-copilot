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
  setRelatedFiles
}) => {
  const listRef = createRef();
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );

  const {
    data,
    refetch: refetchMessages,
    isLoading
  } = useMessagesAPI({ chatId });

  const { startPrompting, questions, files } = usePrompt({
    chatId,
    refetchMessages,
    listRef,
    setRelatedFiles
  });

  const disabled = useMemo(() => !text, [text]);

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

  const onSelectQuestion = (question) => {
    startPrompting(question);
  };

  return (
    <div className={styles.chattingContainer}>
      {!isChat && (
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
      <div className={styles.chatting}>
        <div
          className={classNames(styles.messages, {
            [styles.hasChats]: !isChat,
            [styles.hasIntegrations]: !isChat
          })}
        >
          {data?.lists?.length > 0 || isLoading ? (
            <Messages
              ref={listRef}
              data={data}
              files={files}
              chatId={chatId}
              refetch={refetch}
              isLoading={isLoading}
              questions={questions}
              activeChat={activeChat}
              isStreaming={textGenerator?.isStreaming}
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
        <Input
          text={text}
          disabled={disabled}
          onTexting={onTexting}
          onSend={onSend}
          isStreaming={textGenerator?.isStreaming}
        />
      </div>
    </div>
  );
};

export default Chatting;
