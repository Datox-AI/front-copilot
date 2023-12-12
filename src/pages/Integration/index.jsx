import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { ReactComponent as SnowflakeIcon } from "../../assets/icons/snowflake_light.svg";
import { ReactComponent as ChatsIcon } from "../../assets/icons/chats.svg";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import FileBar from "../Chat/FileBar";

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

const Integration = () => {
  const navigate = useNavigate();

  const { integrationId, chatId } = useParams();

  const [integrations, setIntegrations] = useState([..._integrations]);
  const [chats, setChats] = useState([]);
  const [activeIntegration, setActiveIntegration] = useState(integrations[0]);
  const [activeChat, setActiveChat] = useState(null);

  // useEffect(() => {
  //   if (integrationId) return;

  //   navigate("/chat/1");
  // }, [integrationId]);

  useEffect(() => {
    console.log("asds");
    if (!chatId || chats?.length === 0) return;

    navigate("2");
  }, [chatId, integrationId, chats]);

  useEffect(() => {
    if (!integrationId) return setActiveIntegration(integrations[0]);

    setActiveIntegration(
      integrations.find((inte) => inte.id === Number(integrationId))
    );
  }, [integrationId]);

  const onCloseIntegration = (integrationId) =>
    setIntegrations((prev) => prev.filter((inte) => inte.id !== integrationId));

  const handleSelectIntegration = (integration) =>
    setActiveIntegration(integration);
  const handleSelectChat = (integration) => setActiveChat(integration);

  return (
    <Box width="100%" display="flex">
      <FileBar activeIntegration={activeIntegration} activeChat={activeChat} />
      <Outlet
        context={{
          integrations,
          chats,
          activeChat,
          activeIntegration,
          onCloseIntegration,
          handleSelectChat,
          handleSelectIntegration,
          chatId
        }}
      />
    </Box>
  );
};

export default Integration;
