import { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ReactComponent as GalleryIcon } from "../../../../assets/icons/gallery.svg";
import Input from "../../../Chat/Chatting/Input";
import styles from "../style.module.scss";
import Messages from "../../../Chat/Chatting/Messages";
import useChatsAPI from "../../../../hooks/api/useChatsAPI";
import useMessagesAPI from "../../../../hooks/api/useMessagesAPI";
import usePrompt from "../../../../hooks/usePrompt";
import { _assistantIntegrations } from "../../../../consts/integrations";

export default function PreviewChat({
  messages,
  name,
  assistant,
  description,
  chatId,
  setChatId,
  assistantId,
  isLoading,
  refetch,
  gptIcon
}) {
  const listRef = useRef();

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const { createChat, deleteChat } = useChatsAPI({});

  useEffect(() => {
    // clear preview chat after page reload
    return () => {
      deleteChat.mutate(chatId, {
        onSuccess: () => {
          setChatId(null);
        }
      });
    };
  }, [chatId]);

  useEffect(() => {
    scrollToTheEndOfTheChat();
  }, [messages]);

  const { startPrompting, scrollToTheEndOfTheChat } = usePrompt({
    chatId,
    files,
    listRef,
    assistantId,
    clearFiles: () => setFiles([]),
    refetchMessages: refetch,
    activeIntegration: _assistantIntegrations
  });

  const handleSendMessage = () => {
    setText("");
    setFiles([]);
    startPrompting(text, files);
  };

  const handleCreateChat = () => {
    createChat.mutate(
      { type: "Assistant", assistant_id: assistantId },
      {
        onSuccess: (res) => {
          setChatId(res.id);
        }
      }
    );
  };

  const onSend = () => {
    handleSendMessage(text, files);
  };

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <GalleryIcon />
        </span>
        <h4>Preview</h4>
      </div>

      <div className={styles.messages}>
        {!!chatId && chatId !== "null" ? (
          <Messages
            isLoading={isLoading}
            chatId={chatId}
            isAssistantConfig={true}
            ref={listRef}
            data={messages}
            gptIcon={gptIcon}
            selectedMessages={[]}
            questions={[]}
          />
        ) : (
          <Box display="flex" flexDirection="column" mt={1} p={3}>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <Typography fontSize={14}>Name your assistant: </Typography>
              <Typography fontSize={14} fontWeight={500}>
                {name}
              </Typography>
            </Box>

            <Box display="flex" alignItems="flex-start" gap={1} mt={3}>
              <Typography fontSize={14}>Description: </Typography>
              <Typography fontSize={14} fontWeight={500}>
                {description}
              </Typography>
            </Box>
          </Box>
        )}
      </div>
      {assistantId === "create" && (
        <Button variant="outlined" fullWidth style={{ height: 40 }}>
          Create Assistant First
        </Button>
      )}
      <div className={styles.input}>
        {assistantId !== "create" && (!chatId || chatId === "null") ? (
          <Button
            variant="outlined"
            fullWidth
            style={{ height: 40 }}
            disabled={createChat.isLoading}
            onClick={handleCreateChat}
          >
            {createChat.isLoading ? (
              <CircularProgress size={25} />
            ) : (
              <>Start Chatting</>
            )}
          </Button>
        ) : (
          assistantId !== "create" && (
            <Input
              text={text}
              onSend={onSend}
              onTexting={(e) => setText(e.target.value)}
              showUploadFile={true}
              isAssistantConfig={true}
              placeholder="Message here..."
            />
          )
        )}
      </div>
    </div>
  );
}
