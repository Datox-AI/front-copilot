import FileBar from "../Chat/FileBar";
import websocket from "../../services/websocket";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleIntegration } from "../../redux/integrations/integrationsSlice";
import { _integrations } from "../../consts/integrations";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";
import usePrompt from "../../hooks/usePrompt";
import {
  destroyTextGenerator,
  setTextToGenerator,
  startStreaming,
  stopStreaming
} from "../../redux/chat/chatSlice";
import { useWebSocket } from "../../hooks/useWebSocket";

const Integration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { integrationId, chatId } = useParams();
  const { openedIntegrations } = useSelector((store) => store.integrations);
  const { token, snowflakeToken } = useSelector((store) => store.auth);

  const [activeIntegration, setActiveIntegration] = useState(
    openedIntegrations[0]
  );

  const {
    data,
    refetch,
    singleChat,
    updateSnowflakeData,
    refetchSingleChat,
    isFetching,
    singleAnalyticsChat,
    refetchSingleAnalyticsChat,
    singleRagChat,
    refetchSingleRagChat
  } = useChatsAPI({
    isGetUsers: true,
    chatId,
    chatType:
      activeIntegration?.dataType === "DataAnalytics"
        ? "analytics"
        : activeIntegration?.dataType === "FileSearch" && "rag"
  });

  const { credentials } = useSnowflakeAPI({ enableUserCredentials: true });
  const { onText, onQuestions } = usePrompt({ chatId });
  const {
    websockets,
    addWebSocket,
    sendData,
    removeWebSocket,
    toggleAgentConnection
  } = useWebSocket();

  const [width, setWidth] = useState(284);
  const [activeChat, setActiveChat] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [isAgentConnected, setIsAgentConnected] = useState(false);

  const currentWs = websockets.find((ws) => ws.chatId === chatId);

  const selectDatabase = (item) => {
    if (singleAnalyticsChat)
      updateSnowflakeData.mutate(
        {
          id: chatId,
          body: {
            ...singleAnalyticsChat?.snowflake_data,
            chat_id: chatId,
            database_name: item
          }
        },
        {
          onSuccess: () => refetchSingleAnalyticsChat(),
          onError: () => toast.error("Error on changing database")
        }
      );
    else setSelectedDatabase(item);
  };

  const selectSchema = (item) => {
    if (singleAnalyticsChat)
      updateSnowflakeData.mutate(
        {
          id: chatId,
          body: {
            ...singleAnalyticsChat?.snowflake_data,
            snowflake_schema: item,
            chat_id: chatId
          }
        },
        {
          onSuccess: () => refetchSingleAnalyticsChat(),
          onError: () => toast.error("Error on changing schema")
        }
      );
    else setSelectedSchema(item);
  };

  const handleWebsocketMessage = useCallback(
    (txt) => {
      dispatch(startStreaming({ chatId }));
      if (currentWs?.isAgentConnected)
        sendData(chatId, {
          user_input: txt
        });
    },
    [chatId, currentWs?.isAgentConnected]
  );

  useEffect(() => {
    if (!chatId || Number(integrationId) !== 2) return;

    websockets.forEach((ws) => {
      ws?.socket?.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        switch (message?.message) {
          case "Engine is connected succesfully":
            // setIsAgentConnected(true);
            toggleAgentConnection(ws?.chatId, true);
            break;

          case "Engine is not connected":
            sendData(ws?.chatId, {
              oauth_token: snowflakeToken?.access
            });
            break;

          default:
            if (message?.status !== "error") {
              if (message?.output) {
                onText(message.output);
              }

              if (message?.sql_query) {
                onText(message.sql_query);
              }

              if (message?.followup_questions) {
                onQuestions(message?.followup_questions);
              }

              setTimeout(() => {
                dispatch(stopStreaming({ chatId: ws?.chatId }));
                dispatch(destroyTextGenerator({ chatId: ws?.chatId }));
                refetchSingleAnalyticsChat();
              }, 300);
            } else {
              dispatch(
                setTextToGenerator({
                  chatId,
                  text: "Unexepected error happened"
                })
              );

              // setIsAgentConnected(false);
              toggleAgentConnection(ws?.chatId, false);

              setTimeout(() => {
                // dispatch(stopStreaming({ chatId }));
              }, 300);
            }

            break;
        }
      });
    });

    return () => {
      websockets.forEach((ws) => {
        ws?.socket?.removeEventListener("message", () => {});
      });
    };
  }, [websockets, chatId, activeIntegration, snowflakeToken?.access]);

  useEffect(() => {
    if (chatId && Number(integrationId) === 2) {
      addWebSocket(chatId);
      return;
    }

    // return () => {
    //   console.log("Removing...");
    //   removeWebSocket(chatId);
    // };
  }, [chatId, token, integrationId]);

  useEffect(() => {
    if (!singleAnalyticsChat) return;

    setSelectedDatabase(singleAnalyticsChat.snowflake_data?.database_name);
    setSelectedSchema(singleAnalyticsChat.snowflake_data?.snowflake_schema);
  }, [singleAnalyticsChat]);

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
    const nextIntegration =
      openedIntegrations[foundIntegrationIndex - 1] ||
      openedIntegrations?.[foundIntegrationIndex + 1];

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

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const _width = e.clientX;

      if (_width > 284 && _width < 600) {
        setWidth(_width);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, width]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  useEffect(() => {
    if ((!chatId && !filteredChats) || isFetching) return;

    const foundChat = filteredChats?.find((chat) => chat.id === chatId);

    // if (integrationId && filteredChats?.length > 0 && !foundChat) {
    //   navigate(`/integration/${integrationId}/${filteredChats[0]?.id || ""}`);
    //   return;
    // }

    handleSelectChat(foundChat);
  }, [chatId, filteredChats, integrationId, activeIntegration, isFetching]);

  useEffect(() => {
    if (filteredChats?.length === 0 && activeIntegration)
      navigate(`/integration/${activeIntegration?.id}`);
  }, [filteredChats, activeIntegration]);

  if (!integrationId) return <Navigate to="../" />;

  return (
    <Box width="100%" display="flex">
      <div
        style={{
          width: `${width}px`,
          minWidth: 284,
          maxWidth: 600
        }}
      >
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
      </div>
      <button
        className={"splitter " + (isDragging && "isDragging")}
        onMouseDown={handleMouseDown}
      ></button>

      <div
        style={{
          width: `calc(100% - ${width - 1}px)`
        }}
      >
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
            refetchSingleChat:
              activeIntegration?.dataType === "DataAnalytics"
                ? refetchSingleChat
                : refetchSingleRagChat,
            setRelatedFiles,
            snowflakeCredentials: credentials,
            selectedDatabase,
            selectedSchema,
            isAgentConnected: currentWs?.isAgentConnected,
            chatMessages:
              singleAnalyticsChat?.messages || singleRagChat?.messages,
            isSnowflakeChat: activeIntegration?.dataType === "DataAnalytics",
            sendMessageToAgent: handleWebsocketMessage
          }}
        />
      </div>
    </Box>
  );
};

export default Integration;
