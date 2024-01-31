import FileBar from "../Chat/FileBar";
import websocket from "../../services/websocket";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleIntegration } from "../../redux/integrations/integrationsSlice";
import { _integrations } from "../../consts/integrations";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";

const Integration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { integrationId, chatId } = useParams();
  const { openedIntegrations } = useSelector((store) => store.integrations);
  const { token } = useSelector((store) => store.auth);

  const [activeIntegration, setActiveIntegration] = useState(
    openedIntegrations[0]
  );

  const { data, refetch } = useChatsAPI({
    isGetUsers: true
  });
  const { credentials } = useSnowflakeAPI({ enableUserCredentials: true });

  const [activeChat, setActiveChat] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");

  const selectDatabase = (item) => {
    setSelectedDatabase(item);
  };
  const selectSchema = (item) => {
    setSelectedSchema(item);
  };

  useEffect(() => {
    if (!chatId) return;

    // Connect to WebSocket when component mounts
    websocket.connect(
      `wss://newcopilotwebapi.azurewebsites.net/agent/ws/${chatId}?token=${token}`
    );

    // Add a message handler to update component state
    const handleIncomingMessage = (message) => {
      console.log(message);
    };

    websocket.addMessageHandler(handleIncomingMessage);

    return () => {
      // Remove the message handler when component unmounts
      websocket.removeMessageHandler(handleIncomingMessage);
      // Close WebSocket connection when component unmounts
      websocket.closeConnection();
    };
  }, [chatId, token]);

  useEffect(() => {
    if (!integrationId) return;
    if (openedIntegrations[0]) return;

    dispatch(
      toggleIntegration({
        data: _integrations.find((int) => int.id === integrationId)
      })
    );
  }, [openedIntegrations, integrationId]);

  useEffect(() => {
    if (!integrationId) {
      navigate(openedIntegrations?.[0].id);
      setActiveIntegration(openedIntegrations?.[0]);
      return;
    }
    // TODO: check properly integraton page
    // if (openedIntegrations.length === 0) return;
    // if (!activeIntegration && openedIntegrations.length === 0)
    //   return navigate("/chat");

    const _integration = openedIntegrations?.find(
      (inte) => inte.id === Number(integrationId)
    );

    if (!_integration) {
      const newIntegration = _integrations.find(
        (int) => int.id === Number(integrationId)
      );

      if (!newIntegration) {
        navigate("/");
        return;
      }

      dispatch(toggleIntegration({ data: newIntegration }));
      setActiveIntegration(newIntegration);
      return;
    }

    setActiveIntegration(_integration);
  }, [integrationId, openedIntegrations, activeIntegration]);

  const onCloseIntegration = (integrationId) => {
    const foundIntegrationIndex = openedIntegrations.findIndex(
      (integration) => integration.id === integrationId
    );
    const nextIntegration = openedIntegrations[foundIntegrationIndex - 1];

    dispatch(
      toggleIntegration({ data: openedIntegrations[foundIntegrationIndex] })
    );
    navigate(nextIntegration ? String(nextIntegration.id) : "/chat");
  };

  const handleSelectChat = (integration) => setActiveChat(integration);

  useEffect(() => {
    if (!chatId && !data) return;

    const mutatedData = data?.lists?.filter(
      (chat) =>
        chat?.type ===
        (activeIntegration?.type === "sql" ? "Analytics" : "FileSearch")
    );

    const foundChat = mutatedData?.find((chat) => chat.id === chatId);

    if (integrationId && mutatedData?.length > 0 && (!chatId || !foundChat)) {
      navigate(`/integration/${integrationId}/${mutatedData[0]?.id || ""}`);
    }

    handleSelectChat(foundChat);
  }, [chatId, data, integrationId, activeIntegration]);

  if (!integrationId) return <Navigate to="../" />;

  return (
    <Box width="100%" display="flex">
      <FileBar
        title="Chat"
        refetch={refetch}
        hideNewChatBtn={true}
        activeChat={activeChat}
        relatedFiles={relatedFiles}
        selectSchema={selectSchema}
        selectDatabase={selectDatabase}
        selectedSchema={selectedSchema}
        snowflakeCredentials={credentials}
        selectedDatabase={selectedDatabase}
        activeIntegration={activeIntegration}
      />
      <Outlet
        context={{
          integrations: openedIntegrations,
          chats: data?.lists,
          activeChat,
          activeIntegration,
          onCloseIntegration,
          handleSelectChat,
          chatId,
          refetch,
          setRelatedFiles,
          snowflakeCredentials: credentials,
          selectedDatabase,
          selectedSchema
        }}
      />
    </Box>
  );
};

export default Integration;
