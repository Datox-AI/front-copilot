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
import { createRef, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment-question.svg";
import useChatsAPI from "../../../hooks/api/useChatsAPI";
import { Button, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

const EmptyMessages = ({
  hasChats,
  hasIntegrations,
  isChat,
  snowflakeCredentials,
  selectedDatabase,
  selectedSchema,
  activeIntegration,
  refetch,
  showButton
}) => {
  const navigate = useNavigate();
  const { createChat } = useChatsAPI({});
  const { snowflakeToken } = useSelector((store) => store.auth);

  const onCreate = () => {
    const chatType = activeIntegration?.dataType;

    const payload = {
      type: chatType,
      snowflake_data: {
        ...snowflakeCredentials,
        snowflake_account: snowflakeCredentials?.account_identifier,
        database_name: selectedDatabase,
        snowflake_schema: selectedSchema
      }
    };

    if (activeIntegration?.dataType !== "DataAnalytics")
      delete payload.snowflake_data;
    else {
      if (!snowflakeToken?.access)
        return toast.error(
          "Please connect to snowflake , using connect button in left bar"
        );
      if (!selectedDatabase)
        return toast.error("Please select database to create chat");
      if (!selectedSchema)
        return toast.error("Please select schema to create chat");
    }

    createChat.mutate(payload, {
      onSuccess: (res) => {
        refetch();

        navigate(res.id);
      }
    });
  };

  return (
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
      {showButton && (
        <Button
          variant="contained"
          onClick={onCreate}
          disabled={createChat.isLoading}
        >
          {createChat.isLoading ? <CircularProgress size={30} /> : "Start Chat"}
        </Button>
      )}
    </div>
  );
};

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
  columnName,
  snowflakeCredentials,
  selectedDatabase,
  selectedSchema,
  isAgentConnected,
  sendMessageToAgent,
  isSnowflakeChat,
  chatMessages,
  refetchSingleChat
}) => {
  const listRef = createRef();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );

  const {
    data,
    refetch: refetchMessages,
    isLoading,
    deleteMutation
  } = useMessagesAPI({ chatId: !chatMessages && chatId });

  const {
    files,
    replyMessage,
    startPrompting,
    clearReplyMessage,
    selectReplyMessage,
    scrollToTheEndOfTheChat
  } = usePrompt({
    isRagType: activeIntegration?.dataType === "FileSearch",
    chatId,
    refetchMessages: refetchSingleChat || refetchMessages,
    listRef,
    setRelatedFiles,
    isAgentConnected,
    sendMessageToAgent
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
    data: data || chatMessages,
    isChat,
    chatId,
    isLoading,
    textGenerator,
    deleteMutation,
    setRelatedFiles,
    isSnowflakeChat,
    isAgentConnected,
    startPrompting,
    refetchMessages: refetchSingleChat || refetchMessages
  });

  useEffect(() => {
    scrollToTheEndOfTheChat();
  }, [data, chatMessages]);

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
            snowflakeCredentials={snowflakeCredentials}
            selectedDatabase={selectedDatabase}
            selectedSchema={selectedSchema}
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
              refetch={refetchSingleChat || refetchMessages}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </>
        )}
        <div className={styles.chatting}>
          <div className={styles.messages}>
            {(data || chatMessages)?.length > 0 || isLoading ? (
              <Messages
                ref={listRef}
                data={data || chatMessages}
                mode={mode}
                files={files}
                isAudit={isAudit}
                chatId={chatId}
                refetch={refetch}
                replyMessage={replyMessage}
                isLoading={isLoading}
                questions={textGenerator?.questions || []}
                activeChat={activeChat}
                selectedMessages={selectedMessages}
                isStreaming={textGenerator?.isStreaming}
                isHighlightedMessage={isHighlightedMessage}
                toggleMessage={toggleMessage}
                refetchMessages={refetchSingleChat || refetchMessages}
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
                  refetch={refetch}
                  activeIntegration={activeIntegration}
                  snowflakeCredentials={snowflakeCredentials}
                  selectedDatabase={selectedDatabase}
                  selectedSchema={selectedSchema}
                  showButton={!chatId}
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
              isAgentConnected={isAgentConnected}
              isSnowflakeChat={isSnowflakeChat}
            />
          )}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default Chatting;
