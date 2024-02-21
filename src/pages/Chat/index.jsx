import FileBar from "./FileBar";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [width, setWidth] = useState(284);
  const [activeIntegration] = useState(_integrations[0]);
  const [activeChat, setActiveChat] = useState(null);

  const chats = useMemo(
    () => (isAudit ? data : data?.filter((chat) => chat?.type === "Analytics")),
    [data, isAudit]
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
      <Box
        position="relative"
        width={width}
        minWidth={284}
        maxWidth={600}
        overflow="visible"
      >
        <FileBar
          activeIntegration={activeIntegration}
          chats={chats}
          activeChat={activeChat}
          refetch={refetch}
          isAudit={isAudit}
          snowflakeCredentials={credentials}
          hideNewChatBtn={isAudit}
          title="Chat"
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
      </div>
    </Box>
  );
};

export default Chat;
