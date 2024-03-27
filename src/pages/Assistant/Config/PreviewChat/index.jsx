import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ReactComponent as GalleryIcon } from "../../../../assets/icons/gallery.svg";
import Input from "../../../Chat/Chatting/Input";
import styles from "../style.module.scss";
import Messages from "../../../Chat/Chatting/Messages";

export default function PreviewChat({ messages, name, description }) {
  const [text, setText] = useState("");

  const onSend = () => {
    setText("");
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
        {messages?.length > 0 ? (
          <Messages isLoading={false} isAssistantConfig={true} />
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

      <div className={styles.input}>
        <Input
          text={text}
          onSend={onSend}
          onTexting={(e) => setText(e.target.value)}
          showUploadFile={true}
          isAssistantConfig={true}
          placeholder="Message here..."
        />
      </div>
    </div>
  );
}
