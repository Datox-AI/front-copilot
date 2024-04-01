import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  _assistantIntegrations,
  _integrations
} from "../../../consts/integrations";

import FileBar from "../../Chat/FileBar";
import ExpandableContainer from "../../../components/ExpandableContainer";
import useGetAssistantAPI from "../../../hooks/api/useGetAssistantAPI";
import useGetAssistantChatsAPI from "../../../hooks/api/useGetAssistantChatsAPI";
import useGetAssistantChatMessagesAPI from "../../../hooks/api/useGetAssistantChatMessagesAPI";

const AssistantChat = () => {
  const { assistantId, chatId } = useParams();

  const { data: assistant } = useGetAssistantAPI({ assistantId });
  const { data: chats, refetch } = useGetAssistantChatsAPI({ assistantId });
  const { data: singleChat, refetch: refetchSingleChat } =
    useGetAssistantChatMessagesAPI({
      assistantId,
      chatId
    });

  const { isOpen } = useSelector((store) => store.toggle);

  const [width, setWidth] = useState(284);
  const [activeIntegration] = useState(_assistantIntegrations);
  const [activeChat, setActiveChat] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  useEffect(() => {
    if (!chatId || !chats) return;

    const foundChat = chats?.find((chat) => chat.id === chatId);

    handleSelectChat(foundChat);
  }, [chatId, chats]);

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
          chatId={chatId}
          assistant={assistant}
          activeChat={activeChat}
          assistantId={assistantId}
          activeIntegration={activeIntegration}
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
            gptIcon: assistant?.icon_file_path,
            activeIntegration,
            handleSelectChat,
            chatId,
            refetch,
            assistantId,
            refetchSingleChat: refetchSingleChat,
            chatMessages: singleChat?.messages
          }}
        />
      </div>
    </Box>
  );
};

export default AssistantChat;
