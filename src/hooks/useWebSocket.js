import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectionStatuses } from "../consts/snowflake";

// Custom hook to manage WebSocket connections
export const useWebSocket = () => {
  const [websockets, setWebsockets] = useState([]);
  const { token, snowflakeToken } = useSelector((store) => store.auth);

  // Function to add a new WebSocket connection
  const addWebSocket = (chatId, isAgentConnected = false) => {
    if (websockets.find((ws) => ws.chatId === chatId)) return;

    const socket = new WebSocket(
      `wss://newcopilotwebapi.azurewebsites.net/api/analytics_agent/ws/${chatId}?token=${token}`
    );

    setWebsockets((prevWebsockets) => [
      ...prevWebsockets,
      {
        socket,
        chatId,
        isAgentConnected,
        hasEventListener: false,
        status: connectionStatuses.NOT_CONNECTED
      }
    ]);
  };

  // Function to remove a WebSocket connection
  const removeWebSocket = (chatId) => {
    setWebsockets((prevWebsockets) =>
      prevWebsockets.filter((ws) => ws.chatId !== chatId)
    );
  };

  // Function to send data through a WebSocket connection
  const sendData = (chatId, data) => {
    const socket = websockets.find((ws) => ws.chatId === chatId)?.socket;
    if (socket) {
      console.log(data);
      socket.send(JSON.stringify(data));
    }
  };

  const toggleAgentConnection = (chatId, value) => {
    setWebsockets((prevWebsockets) =>
      prevWebsockets.map((ws) =>
        ws.chatId === chatId ? { ...ws, isAgentConnected: value } : ws
      )
    );
  };

  const toggleHasEventListener = (chatId, value) => {
    setWebsockets((prevWebsockets) =>
      prevWebsockets.map((ws) =>
        ws.chatId === chatId ? { ...ws, hasEventListener: value } : ws
      )
    );
  };

  const changeSocketStatus = (chatId, status) => {
    setWebsockets((prevWebsockets) =>
      prevWebsockets.map((ws) =>
        ws.chatId === chatId ? { ...ws, status } : ws
      )
    );
  };

  useEffect(() => {
    return () => {
      websockets.forEach(({ socket }) => {
        console.log(`${socket.chatId} - closing`);
        socket?.socket?.close();
      });

      setWebsockets([]);
    };
  }, []);

  useEffect(() => {
    websockets?.forEach((ws) => {
      ws.socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
        toggleAgentConnection(ws.chatId, false);
      };

      ws.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    });

    return () => {
      // Clean up WebSocket connections when component unmounts
      //   websockets.forEach(({ socket }) => {
      //     socket.close();
      //   });
    };
  }, [websockets]);

  return {
    websockets,
    addWebSocket,
    removeWebSocket,
    sendData,
    toggleAgentConnection,
    toggleHasEventListener,
    changeSocketStatus
  };
};
