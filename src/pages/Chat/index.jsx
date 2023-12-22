import FileBar from "./FileBar";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { _integrations } from "../../consts/integrations";

const Chat = ({ isAudit }) => {
  const { chatId, userId } = useParams();
  const { data, refetch } = useChatsAPI({
    isGetUsers: true
    // userId
  });

  const [relatedFiles, setRelatedFiles] = useState([]);
  const [activeIntegration] = useState(_integrations[0]);
  const [activeChat, setActiveChat] = useState(null);

  const chats = useMemo(
    () =>
      isAudit
        ? data?.lists
        : data?.lists?.filter((chat) => chat?.type === "Analytics"),
    [data, isAudit]
  );

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  useEffect(() => {
    if (!chatId || !data) return;

    const foundChat = data?.lists?.find((chat) => chat.id === chatId);

    handleSelectChat(foundChat);
  }, [chatId, data?.lists]);

  return (
    <Box width="100%" display="flex">
      <FileBar
        activeIntegration={activeIntegration}
        chats={chats}
        activeChat={activeChat}
        refetch={refetch}
        isAudit={isAudit}
        hideNewChatBtn={isAudit}
        title="Chat"
      />
      <Outlet
        context={{
          chats: chats,
          activeChat,
          activeIntegration,
          handleSelectChat,
          chatId,
          refetch,
          setRelatedFiles,
          isAudit
        }}
      />
    </Box>
  );
};

export default Chat;
