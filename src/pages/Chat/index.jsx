import FileBar from "./FileBar";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { _integrations } from "../../consts/integrations";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";

const Chat = ({ isAudit }) => {
  const { chatId, userId } = useParams();
  const { data, refetch } = useChatsAPI({
    isGetUsers: true,
    userId
  });

  const { credentials } = useSnowflakeAPI({ enableUserCredentials: true });

  const [relatedFiles, setRelatedFiles] = useState([]);
  const [activeIntegration] = useState(_integrations[0]);
  const [activeChat, setActiveChat] = useState(null);

  const chats = useMemo(
    () =>
      isAudit
        ? data.length > 0
        : data?.filter((chat) => chat?.type === "Analytics"),
    [data, isAudit]
  );

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  useEffect(() => {
    if (!chatId || !data) return;

    const foundChat = data?.find((chat) => chat.id === chatId);

    handleSelectChat(foundChat);
  }, [chatId, data]);

  return (
    <Box width="100%" display="flex">
      <FileBar
        activeIntegration={activeIntegration}
        chats={chats}
        activeChat={activeChat}
        refetch={refetch}
        isAudit={isAudit}
        snowflakeCredentials={credentials}
        hideNewChatBtn={isAudit}
        title="Chat"
      />{" "}
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
          // snowflakeCredentials: credentials
        }}
      />
    </Box>
  );
};

export default Chat;
