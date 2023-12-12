import Input from "./Input";
import Messages from "./Messages";
import styles from "./style.module.scss";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment-question.svg";
import TopChatList from "./TopChatList";
import classNames from "classnames";
import { createRef, useMemo, useState } from "react";
import useMessagesAPI from "../../../hooks/api/useMessagesAPI";
import usePrompt from "../../../hooks/usePrompt";
import Popup from "../../../components/Popup";
import MessageItemSkeleton from "./Messages/MessageItem/index.skeleton";

const EmptyMessages = ({ hasChats, hasIntegrations }) => (
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
    <h3>Ask a question!</h3>
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
  refetch
}) => {
  const listRef = createRef();

  const [text, setText] = useState("");

  const {
    data,
    refetch: refetchMessages,
    isLoading
  } = useMessagesAPI({ chatId });

  const { startPrompting, questions } = usePrompt({
    chatId,
    refetchMessages,
    listRef
  });

  const disabled = useMemo(() => !text, [text]);

  const onTexting = (e) => {
    setText(e.target.value);
  };

  const onSend = (e) => {
    e.preventDefault();
    setText("");

    startPrompting(text);
  };

  const onSelectQuestion = (question) => {
    startPrompting(question);
  };

  return (
    <div className={styles.chattingContainer}>
      <TopChatList
        chats={chats}
        integrations={integrations}
        activeChat={activeChat}
        activeIntegration={activeIntegration}
        handleSelectChat={handleSelectChat}
        handleSelectIntegration={handleSelectIntegration}
        onCloseIntegration={onCloseIntegration}
        isChat={isChat}
      />
      <div className={styles.chatting}>
        <div
          className={classNames(
            styles.emptyMessages,
            {
              [styles.hasChats]: chats?.length > 0 || isChat
            },
            {
              [styles.hasIntegrations]: integrations.length > 0 || isChat
            }
          )}
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
            />
          ) : (
            <EmptyMessages
              hasChats={chats.length > 0 || !isChat}
              hasIntegrations={integrations.length > 0}
            />
          )}
        </div>
        <Input
          text={text}
          disabled={disabled}
          onTexting={onTexting}
          onSend={onSend}
        />
      </div>
    </div>
  );
};

export default Chatting;
