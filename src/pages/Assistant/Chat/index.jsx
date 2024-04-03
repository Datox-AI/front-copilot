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
import OptionsBar from "../../Integration/OptionsBar";

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
  const [width2, setWidth2] = useState(284);
  const [activeIntegration] = useState(_assistantIntegrations);
  const [activeChat, setActiveChat] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);

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
        bgcolor="#fff"
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

      {!!chatId && (
        <ExpandableContainer
          width={width2}
          setWidth={setWidth2}
          extraOffset={width}
          initWidth={284}
          bgcolor="transparent"
          maxWidth={600}
          zIndex={99}
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
            hideNewChatBtn={true}
            relatedFiles={relatedFiles}
            assistantId={assistantId}
            activeIntegration={activeIntegration}
            toggleContainer={() => {
              setIsExpanded2((prev) => {
                if (prev) setWidth2(50);
                else setWidth2(284);

                return !prev;
              });
            }}
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
            chats: chats,
            activeChat,
            gptIcon: assistant?.icon_file_path,
            activeIntegration,
            handleSelectChat,
            chatId,
            refetch,
            assistantId,
            setRelatedFiles,
            refetchSingleChat: refetchSingleChat,
            chatMessages: singleChat?.messages
          }}
        />
      </div>
    </Box>
  );
};

export default AssistantChat;
