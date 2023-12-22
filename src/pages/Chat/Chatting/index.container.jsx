import { useEffect, useState } from "react";
import Chatting from ".";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const ChattingContainer = ({}) => {
  const { pathname } = useLocation();

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
    isAudit
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
      setRelatedFiles={setRelatedFiles}
      isAudit={isAudit}
    />
  );
};

export default ChattingContainer;
