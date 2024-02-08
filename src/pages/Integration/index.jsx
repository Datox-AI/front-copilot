import FileBar from "../Chat/FileBar";
import websocket from "../../services/websocket";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleIntegration } from "../../redux/integrations/integrationsSlice";
import { _integrations } from "../../consts/integrations";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";

const Integration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { integrationId, chatId } = useParams();
  const { openedIntegrations } = useSelector((store) => store.integrations);
  const { token, snowflakeToken } = useSelector((store) => store.auth);

  const [activeIntegration, setActiveIntegration] = useState(
    openedIntegrations[0]
  );

  const { data, refetch, singleChat, updateSnowflakeData, refetchSingleChat } =
    useChatsAPI({
      isGetUsers: true,
      chatId
    });

  const { credentials } = useSnowflakeAPI({ enableUserCredentials: true });

  const [activeChat, setActiveChat] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");

  const selectDatabase = (item) => {
    if (singleChat)
      updateSnowflakeData.mutate(
        {
          id: chatId,
          body: {
            ...singleChat?.snowflake_data,
            chat_id: chatId,
            database_name: item
          }
        },
        {
          onSuccess: () => refetchSingleChat(),
          onError: () => toast.error("Error on changing database")
        }
      );
    else setSelectedDatabase(item);
  };
  const selectSchema = (item) => {
    if (singleChat)
      updateSnowflakeData.mutate(
        {
          id: chatId,
          body: {
            ...singleChat?.snowflake_data,
            snowflake_schema: item,
            chat_id: chatId
          }
        },
        {
          onSuccess: () => refetchSingleChat(),
          onError: () => toast.error("Error on changing schema")
        }
      );
    else setSelectedSchema(item);
  };

  useEffect(() => {
    if (!chatId) return;

    // Connect to WebSocket when component mounts
    websocket.connect(
      `wss://newcopilotwebapi.azurewebsites.net/api/analytics_agent/ws/${chatId}?token=${token}`
    );

    // Add a message handler to update component state
    const handleIncomingMessage = (message) => {
      console.log(message);
      if (message?.message === "Engine is not connected") {
        websocket.sendMessage({
          oauth_token: snowflakeToken?.access
        });
      }
    };

    websocket.addMessageHandler(handleIncomingMessage);

    return () => {
      // Remove the message handler when component unmounts
      websocket.removeMessageHandler(handleIncomingMessage);
      // Close WebSocket connection when component unmounts
      websocket.closeConnection();
    };
  }, [chatId, token, snowflakeToken]);

  useEffect(() => {
    if (!singleChat) return;

    setSelectedDatabase(singleChat.snowflake_data?.database_name);
    setSelectedSchema(singleChat.snowflake_data?.snowflake_schema);
  }, [singleChat]);

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

  const filteredChats = useMemo(
    () => data?.filter((chat) => chat?.type === activeIntegration?.dataType),
    [activeIntegration, data]
  );

  useEffect(() => {
    if (!chatId && !filteredChats) return;

    const foundChat = filteredChats?.find((chat) => chat.id === chatId);

    if (integrationId && filteredChats?.length > 0 && (!chatId || !foundChat)) {
      navigate(`/integration/${integrationId}/${filteredChats[0]?.id || ""}`);
    }

    handleSelectChat(foundChat);
  }, [chatId, filteredChats, integrationId, activeIntegration]);

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
          chats: filteredChats,
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
