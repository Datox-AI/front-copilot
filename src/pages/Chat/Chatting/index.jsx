import Input from "./Input";
import Messages from "./Messages";
import styles from "./style.module.scss";
import TopChatList from "./TopChatList";
import classNames from "classnames";
import useMessagesAPI from "../../../hooks/api/useMessagesAPI";
import usePrompt from "../../../hooks/usePrompt";
import searchFileIcon from "../../../assets/icons/search-files.png";
import PinnedMessages from "./PinnedMessages";
import SelectedMessages from "./SelectedMessages";
import useChatting from "../../../hooks/useChatting";

import { useSelector } from "react-redux";
import { createRef } from "react";
import { Outlet } from "react-router-dom";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment-question.svg";

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
  isAudit,
  columnName
}) => {
  const listRef = createRef();

  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );

  const {
    data,
    refetch: refetchMessages,
    isLoading,
    deleteMutation
  } = useMessagesAPI({ chatId });

  const {
    files,
    questions,
    replyMessage,
    startPrompting,
    clearReplyMessage,
    selectReplyMessage
  } = usePrompt({
    chatId,
    refetchMessages,
    listRef,
    setRelatedFiles
  });

  const {
    mode,
    text,
    disabled,
    pinnedMessages,
    selectedMessages,
    isHighlightedMessage,
    onSend,
    onTexting,
    onFileUpload,
    toggleMessage,
    onSelectQuestion,
    onHighlightMessage,
    clearAllSelectedMessages,
    deleteAllSelectedMessages,
    handleCopySelectedMessages
  } = useChatting({
    data,
    isChat,
    chatId,
    isLoading,
    textGenerator,
    deleteMutation,
    setRelatedFiles,
    startPrompting,
    refetchMessages
  });

  return (
    <>
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
              [styles.hasPinnedMessages]:
                pinnedMessages?.length > 0 && !isAudit,
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
                replyMessage={replyMessage}
                isLoading={isLoading}
                questions={questions}
                activeChat={activeChat}
                selectedMessages={selectedMessages}
                isStreaming={textGenerator?.isStreaming}
                isHighlightedMessage={isHighlightedMessage}
                toggleMessage={toggleMessage}
                refetchMessages={refetchMessages}
                onSelectQuestion={onSelectQuestion}
                clearReplyMessage={clearReplyMessage}
                selectReplyMessage={selectReplyMessage}
                onHighlightMessage={onHighlightMessage}
              />
            ) : (
              !columnName && (
                <EmptyMessages
                  hasChats={chats?.length > 0 || !isChat}
                  hasIntegrations={integrations?.length > 0}
                  isChat={isChat}
                />
              )
            )}
          </div>
          {chatId && !isAudit && (
            <Input
              chatId={chatId}
              text={text}
              disabled={disabled}
              onTexting={onTexting}
              onSend={onSend}
              onFileUpload={onFileUpload}
              replyMessage={replyMessage}
              clearReplyMessage={clearReplyMessage}
              isStreaming={textGenerator?.isStreaming}
            />
          )}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default Chatting;
