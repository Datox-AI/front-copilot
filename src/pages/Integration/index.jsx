import FileBar from "../Chat/FileBar";
import useChatsAPI from "../../hooks/api/useChatsAPI";
import toast from "react-hot-toast";

import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleIntegration } from "../../redux/integrations/integrationsSlice";
import { _integrations } from "../../consts/integrations";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";
import {
  destroyTextGenerator,
  setQuestionsToGenerator,
  setTextToGenerator,
  startStreaming,
  stopStreaming
} from "../../redux/chat/chatSlice";
import { useWebSocket } from "../../hooks/useWebSocket";
import {
  connectionStatuses,
  snowflakeMessageHandlers
} from "../../consts/snowflake";

import { refreshSnowflakeToken } from "../../utils/snowflakeAPI";
import {
  setSnowflakeRefreshToken,
  setSnowflakeToken,
  setToken
} from "../../redux/auth/authSlice";

const Integration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { integrationId, chatId } = useParams();
  const { openedIntegrations } = useSelector((store) => store.integrations);
  const { snowflakeToken, token } = useSelector((store) => store.auth);
  const { isOpen } = useSelector((store) => store.toggle);
  const { credentials } = useSnowflakeAPI({ enableUserCredentials: true });

  const [activeIntegration, setActiveIntegration] = useState(
    openedIntegrations[0]
  );

  const {
    data,
    refetch,
    updateSnowflakeData,
    isFetching,
    singleAnalyticsChat,
    refetchSingleAnalyticsChat,
    singleRagChat,
    refetchSingleRagChat
  } = useChatsAPI({
    isGetUsers: true,
    chatId,
    chatType: activeIntegration?.dataType
  });

  const {
    websockets,
    addWebSocket,
    sendData,
    removeWebSocket,
    toggleHasEventListener,
    changeSocketStatus
  } = useWebSocket();

  const [width, setWidth] = useState(284);
  const [activeChat, setActiveChat] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");

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
      if (currentWs?.status === connectionStatuses.CONNECTED) {
        dispatch(startStreaming({ chatId: currentWs?.chatId }));
        sendData(currentWs?.chatId, {
          user_input: txt
        });
      }
    },
    [currentWs?.chatId, currentWs?.status]
  );

  const handleWsStopStreaming = () => {
    sendData(currentWs?.chatId, {
      command: "stop"
    });
  };

  useEffect(() => {
    if (!chatId || Number(integrationId) !== 2) return;

    websockets.forEach((ws) => {
      if (!ws.hasEventListener) {
        toggleHasEventListener(chatId, true);
        ws.socket.addEventListener("message", async (event) => {
          event.preventDefault();
          const message = JSON.parse(event.data);
          console.log(message);

          switch (message?.message) {
            case snowflakeMessageHandlers.SUCCESSFULY_CONNECTED:
              changeSocketStatus(ws?.chatId, connectionStatuses.CONNECTED);

              break;

            case snowflakeMessageHandlers.NOT_CONNECTED:
              changeSocketStatus(ws?.chatId, connectionStatuses.CONNECTING);
              sendData(ws?.chatId, {
                snowflake_oauth: snowflakeToken?.access
              });

              break;

            case snowflakeMessageHandlers.STOPPED:
              dispatch(stopStreaming({ chatId: ws?.chatId }));

              refetchSingleAnalyticsChat();

              break;

            case snowflakeMessageHandlers.AZURE_TOKEN_EXPIRED:
            case snowflakeMessageHandlers.AZURE_TOKEN_INVALID:
              changeSocketStatus(ws?.chatId, connectionStatuses.CONNECTING);

              const azureRes = await refreshSnowflakeToken();

              sendData(ws?.chatId, {
                snowflake_oauth: snowflakeToken?.access,
                token: azureRes?.accessToken
              });

              dispatch(setToken(res?.accessToken));

              break;

            case snowflakeMessageHandlers.SNOWFLAKE_TOKEN_INVALID:
            case snowflakeMessageHandlers.SNOWFLAKE_TOKEN_EXPIRED:
              changeSocketStatus(ws?.chatId, connectionStatuses.CONNECTING);

              const res = await refreshSnowflakeToken();
              console.log(res);

              sendData(ws?.chatId, {
                snowflake_oauth: res?.access_token,
                token: token
              });

              dispatch(setSnowflakeToken(res?.access_token));

              if (res.refresh_token)
                dispatch(setSnowflakeRefreshToken(res.refresh_token));

              break;

            default:
              if (message?.status !== "error") {
                // if (message?.output) {
                //   dispatch(
                //     setTextToGenerator({
                //       chatId: message?.chat_id,
                //       text: message.output
                //     })
                //   );
                // }

                // if (message?.sql_query) {
                //   dispatch(
                //     setTextToGenerator({
                //       chatId: message?.chat_id,
                //       text: message.sql_query
                //     })
                //   );
                // }

                // if (message?.followup_questions) {
                //   dispatch(
                //     setQuestionsToGenerator({
                //       chatId: ws?.chatId,
                //       questions: message?.followup_questions
                //     })
                //   );
                // }

                setTimeout(() => {
                  dispatch(stopStreaming({ chatId: ws?.chatId }));
                  dispatch(destroyTextGenerator({ chatId: ws?.chatId }));
                  refetchSingleAnalyticsChat();
                }, 300);
              } else {
                toast.error(message?.message);
                changeSocketStatus(
                  ws?.chatId,
                  connectionStatuses.NOT_CONNECTED
                );

                dispatch(
                  setTextToGenerator({
                    chatId: ws?.chatId,
                    text: `Unexepected error happened: ${message?.message}`
                  })
                );

                dispatch(
                  stopStreaming({
                    chatId: ws?.chatId
                  })
                );
              }

              break;
          }
        });
      }
    });

    return () => {
      websockets.forEach((ws) => {
        ws?.socket?.removeEventListener("message", (e) => console.log(e));
      });
    };
  }, [websockets, chatId, activeIntegration, snowflakeToken?.access, token]);

  useEffect(() => {
    if (!chatId || Number(integrationId) !== 2) return;

    const interval = setInterval(() => {
      if (currentWs?.status === connectionStatuses.NOT_CONNECTED) {
        console.log(snowflakeToken?.access, snowflakeToken);

        if (currentWs.socket.readyState === WebSocket.CLOSED) {
          addWebSocket(chatId);
        } else {
          changeSocketStatus(currentWs?.chatId, connectionStatuses.CONNECTING);
          sendData(currentWs?.chatId, {
            snowflake_oauth: snowflakeToken?.access
          });
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    chatId,
    integrationId,
    currentWs?.status,
    currentWs?.chatId,
    snowflakeToken?.access
  ]);

  useEffect(() => {
    if (chatId && Number(integrationId) === 2) {
      addWebSocket(chatId);
      return;
    }

    // return () => {
    //   console.log("Removing...");
    //   removeWebSocket(chatId);
    // };
  }, [chatId, integrationId]);

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

      const _width = isOpen ? e.clientX - 280 : e.clientX - 90;

      if (_width < 600 && _width > 284) {
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
  }, [isDragging, width, isOpen]);

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
      <Box
        position="relative"
        width={width}
        minWidth={284}
        maxWidth={600}
        overflow="visible"
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

        <button
          className={"splitter " + (isDragging && "isDragging")}
          onMouseDown={handleMouseDown}
        ></button>
      </Box>

      <div
        style={{
          width: `calc(100% - ${width}px)`
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
                ? refetchSingleAnalyticsChat
                : refetchSingleRagChat,
            setRelatedFiles,
            snowflakeCredentials: credentials,
            selectedDatabase,
            selectedSchema,
            snowflakeConnectionStatus: currentWs?.status,
            isAgentConnected:
              currentWs?.status === connectionStatuses.CONNECTED,
            chatMessages:
              singleAnalyticsChat?.messages || singleRagChat?.messages,
            isSnowflakeChat: activeIntegration?.dataType === "DataAnalytics",
            sendMessageToAgent: handleWebsocketMessage,
            handleWsStopStreaming
          }}
        />
      </div>
    </Box>
  );
};

export default Integration;
