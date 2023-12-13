import Input from "./Input";
import Messages from "./Messages";
import styles from "./style.module.scss";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment-question.svg";
import TopChatList from "./TopChatList";
import classNames from "classnames";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import useMessagesAPI from "../../../hooks/api/useMessagesAPI";
import usePrompt from "../../../hooks/usePrompt";
import { arrayUniqueByKey } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { stopStreaming } from "../../../redux/chat/chatSlice";

const EmptyMessages = ({ hasChats, hasIntegrations, isChat }) => (
  <div
    className={classNames(
      styles.emptyMessages,
      {
        [styles.hasChats]: hasChats
      },
      {
        [styles.hasIntegrations]: hasIntegrations
      }
    )}
  >
    <CommentIcon />
    <h3>{!isChat ? "Search Files" : "Ask a question!"}</h3>
    <p>
      Effective questioning involves more than just forming inquiries; it
      requires a thoughtful approach.
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

  const { startPrompting, questions } = usePrompt({
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
              chatId={chatId}
              data={data}
              refetchMessages={refetchMessages}
              ref={listRef}
              questions={questions}
              onSelectQuestion={onSelectQuestion}
              activeChat={activeChat}
              refetch={refetch}
              isLoading={isLoading}
              isStreaming={textGenerator?.isStreaming}
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
