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
import ExpandableContainer from "../../components/ExpandableContainer";
import OptionsBar from "./OptionsBar";

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
  } = useWebSocket({ refetch: refetchSingleAnalyticsChat });

  const [width, setWidth] = useState(284);
  const [width2, setWidth2] = useState(284);
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

              dispatch(setToken(azureRes?.accessToken));

              sendData(ws?.chatId, {
                snowflake_oauth: snowflakeToken?.access
              });

              break;

            case snowflakeMessageHandlers.SNOWFLAKE_TOKEN_INVALID:
            case snowflakeMessageHandlers.SNOWFLAKE_TOKEN_EXPIRED:
              changeSocketStatus(ws?.chatId, connectionStatuses.CONNECTING);

              const res = await refreshSnowflakeToken();

              sendData(ws?.chatId, {
                snowflake_oauth: res?.access_token
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

    const interval = setInterval(async () => {
      if (currentWs?.status === connectionStatuses.NOT_CONNECTED) {
        let snowflakeAccessToken;

        if (!snowflakeToken.access && snowflakeToken.refresh) {
          const res = await refreshSnowflakeToken();

          dispatch(setSnowflakeToken(res.access_token));
          snowflakeAccessToken = res.access_token;
        }

        if (currentWs.socket.readyState === WebSocket.CLOSED) {
          addWebSocket(chatId);
        } else {
          changeSocketStatus(currentWs?.chatId, connectionStatuses.CONNECTING);
          sendData(currentWs?.chatId, {
            snowflake_oauth: snowflakeToken?.access || snowflakeAccessToken
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

  useEffect(() => {
    if ((!chatId && !filteredChats) || isFetching) return;

    const foundChat = filteredChats?.find((chat) => chat.id === chatId);

    handleSelectChat(foundChat);
  }, [chatId, filteredChats, integrationId, activeIntegration, isFetching]);

  useEffect(() => {
    if (filteredChats?.length === 0 && activeIntegration)
      navigate(`/integration/${activeIntegration?.id}`);
  }, [filteredChats, activeIntegration]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);

  if (!integrationId) return <Navigate to="../" />;

  return (
    <Box width="100%" display="flex">
      <ExpandableContainer
        width={width}
        setWidth={setWidth}
        initWidth={284}
        maxWidth={600}
        isOpen={isOpen}
        bgcolor="#fff"
        style={{
          maxWidth: !isExpanded && "50px",
          minWidth: !isExpanded && "50px",
          overflow: !isExpanded && "hidden"
        }}
      >
        <FileBar
          title="Chat"
          isOpenContainer={isExpanded}
          toggleContainer={() => {
            setIsExpanded((prev) => {
              if (prev) setWidth(50);
              else setWidth(284);

              return !prev;
            });
          }}
          refetch={refetch}
          activeChat={activeChat}
          relatedFiles={relatedFiles}
          chats={filteredChats}
          snowflakeCredentials={credentials}
          selectedSchema={selectedSchema}
          selectedDatabase={selectedDatabase}
          activeIntegration={activeIntegration}
        />
      </ExpandableContainer>

      {!!chatId && (
        <ExpandableContainer
          width={width2}
          setWidth={setWidth2}
          extraOffset={width}
          initWidth={284}
          bgcolor="transparent"
          maxWidth={600}
          isOpen={isOpen}
          style={{
            maxWidth: !isExpanded2 && "50px",
            minWidth: !isExpanded2 && "50px",
            overflow: !isExpanded2 && "hidden"
          }}
        >
          <OptionsBar
            title={null}
            isOpenContainer={isExpanded2}
            toggleContainer={() => {
              setIsExpanded2((prev) => {
                if (prev) setWidth2(50);
                else setWidth2(284);

                return !prev;
              });
            }}
            hideNewChatBtn={true}
            relatedFiles={relatedFiles}
            selectSchema={selectSchema}
            selectDatabase={selectDatabase}
            selectedSchema={selectedSchema}
            selectedDatabase={selectedDatabase}
            snowflakeCredentials={credentials}
            activeIntegration={activeIntegration}
          />
        </ExpandableContainer>
      )}

      <div
        style={{
          width: `calc(100% - ${width + (!!chatId ? width2 : 0)}px)`
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
