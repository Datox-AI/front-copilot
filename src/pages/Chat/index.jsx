import FileBar from "./FileBar";
import Chatting from "./Chatting";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { ReactComponent as SnowflakeIcon } from "../../assets/icons/snowflake_light.svg";
import { ReactComponent as ChatsIcon } from "../../assets/icons/chats.svg";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import useChatsAPI from "../../hooks/api/useChatsAPI";

const _integrations = [
  {
    id: 1,
    name: null,
    icon: <ChatsIcon />,
    to: "/chat",
    type: "messages"
  },
  {
    id: 2,
    name: "Snowflake",
    icon: <SnowflakeIcon />,
    to: "/integration/2",
    type: "sql"
  },
  {
    id: 3,
    name: "SharePoint",
    icon: <SnowflakeIcon />,
    to: "/integration/3",
    type: "files"
  },
  {
    id: 4,
    name: "Dropbox",
    icon: <SnowflakeIcon />,
    to: "/integration/4",
    type: "files"
  }
];

const Chat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { data, isLoading, refetch } = useChatsAPI({
    isGetUsers: true
  });

  const [integrations] = useState([..._integrations]);
  const [activeIntegration] = useState(integrations[0]);
  const [activeChat, setActiveChat] = useState(null);

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
        chats={data?.lists}
        activeChat={activeChat}
        refetch={refetch}
      />
      <Outlet
        context={{
          integrations,
          chats: data?.lists,
          activeChat,
          activeIntegration,
          handleSelectChat,
          chatId,
          refetch
        }}
      />
    </Box>
  );
};

export default Chat;
