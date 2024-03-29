import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  _assistantIntegrations,
  _integrations
} from "../../../consts/integrations";
import useSnowflakeAPI from "../../../hooks/api/useSnowflakeAPI";
import useChatsAPI from "../../../hooks/api/useChatsAPI";
import FileBar from "../../Chat/FileBar";
import ExpandableContainer from "../../../components/ExpandableContainer";
import useGetAssistantAPI from "../../../hooks/api/useGetAssistantAPI";

const AssistantChat = ({ isAudit }) => {
  const { assistantId, chatId, userId } = useParams();

  const { data: assistant } = useGetAssistantAPI({ assistantId });

  const { data, refetch } = useChatsAPI({
    isGetUsers: true,
    userId
  });

  const { credentials } = useSnowflakeAPI({ enableUserCredentials: true });
  const { isOpen } = useSelector((store) => store.toggle);

  const [relatedFiles, setRelatedFiles] = useState([]);
  const [width, setWidth] = useState(284);
  const [activeIntegration] = useState(_assistantIntegrations);
  const [activeChat, setActiveChat] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const chats = useMemo(
    () => (isAudit ? data : data?.filter((chat) => chat?.type === "Analytics")),
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
      <ExpandableContainer
        width={width}
        setWidth={setWidth}
        initWidth={284}
        maxWidth={600}
        isOpen={isOpen}
        bgcolor="transparent"
        zIndex={100}
        style={{
          maxWidth: !isExpanded && "50px",
          minWidth: !isExpanded && "50px",
          overflow: !isExpanded && "hidden"
        }}
      >
        <FileBar
          title="Chat"
          chats={chats}
          refetch={refetch}
          isAudit={isAudit}
          assistant={assistant}
          activeChat={activeChat}
          hideNewChatBtn={isAudit}
          assistantId={assistantId}
          activeIntegration={activeIntegration}
          snowflakeCredentials={credentials}
          isOpenContainer={isExpanded}
          toggleContainer={() => {
            setIsExpanded((prev) => {
              if (prev) setWidth(50);
              else setWidth(284);

              return !prev;
            });
          }}
        />
      </ExpandableContainer>

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

export default AssistantChat;
