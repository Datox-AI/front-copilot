import { useEffect, useState } from "react";
import Chatting from ".";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams
} from "react-router-dom";

const ChattingContainer = ({}) => {
  const { pathname } = useLocation();
  const { columnName } = useParams();

  const {
    integrations,
    chats,
    activeChat,
    activeIntegration,
    onCloseIntegration,
    handleSelectChat,
    handleSelectIntegration,
    chatId,
    refetch,
    setRelatedFiles,
    isAudit,
    snowflakeCredentials,
    selectedDatabase,
    selectedSchema,
    isAgentConnected,
    sendMessageToAgent,
    isSnowflakeChat,
    chatMessages,
    refetchSingleChat
  } = useOutletContext();

  return (
    <Chatting
      integrations={integrations}
      chats={chats}
      activeChat={activeChat}
      activeIntegration={activeIntegration}
      onCloseIntegration={onCloseIntegration}
      handleSelectChat={handleSelectChat}
      handleSelectIntegration={handleSelectIntegration}
      isCreate={pathname.includes("create")}
      isChat={pathname.includes("chat")}
      chatId={chatId}
      refetch={refetch}
      columnName={columnName}
      setRelatedFiles={setRelatedFiles}
      isAudit={isAudit}
      snowflakeCredentials={snowflakeCredentials}
      selectedDatabase={selectedDatabase}
      selectedSchema={selectedSchema}
      isAgentConnected={isAgentConnected}
      sendMessageToAgent={sendMessageToAgent}
      isSnowflakeChat={isSnowflakeChat}
      chatMessages={chatMessages}
      refetchSingleChat={refetchSingleChat}
    />
  );
};

export default ChattingContainer;
