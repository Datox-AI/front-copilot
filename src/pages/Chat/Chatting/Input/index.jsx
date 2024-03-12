import styles from "./style.module.scss";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import ReplyState from "./States/Reply";
import UploadFiles from "./States/UploadFiles";
import { motion } from "framer-motion";

import { ReactComponent as SendIcon } from "../../../../assets/icons/PaperPlaneRight.svg";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ConnectionStatuses from "./ConnectionStatuses";
import { connectionStatuses } from "../../../../consts/snowflake";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { ReactComponent as CheckedIcon } from "../../../../assets/icons/checked.svg";

const Input = ({
  chatId,
  text,
  disabled,
  onSend,
  onTexting,
  isStreaming,
  replyMessage,
  onFileUpload,
  isSnowflakeChat,
  showUploadFile,
  clearReplyMessage,
  snowflakeConnectionStatus
}) => {
  const textareaRef = useRef(null);
  const files = useSelector((store) => store.chat.files[chatId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of adding a new line
      // Here you can handle whatever you want to do when Enter is pressed without Shift

      onSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      // Here you can handle whatever you want to do when Enter is pressed with Shift
      console.log("Shift+Enter key pressed");
      onTexting({
        target: {
          value: [text, "\n"].join("")
        }
      });
    }
  };

  useEffect(() => {
    // Automatically adjust the height of the textarea when the content changes
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const connectionStatus = () => {
    switch (snowflakeConnectionStatus) {
      case connectionStatuses.NOT_CONNECTED:
        return {
          icon: (
            <CloseRoundedIcon
              style={{
                width: 18,
                height: 18,
                color: "red"
              }}
            />
          ),
          title: "Not connected"
        };

      case connectionStatuses.CONNECTING:
        return {
          icon: (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AutorenewRoundedIcon />
            </motion.span>
          ),
          title: "Connecting..."
        };

      case connectionStatuses.CONNECTED:
        return {
          icon: (
            <CheckedIcon
              style={{
                width: 18,
                height: 18
              }}
            />
          ),
          title: "Connected"
        };

      default:
        return <></>;
    }
  };

  return (
    <>
      {isSnowflakeChat && (
        <p className={styles.snowflakeConnectionStatus}>
          {connectionStatus().icon} {connectionStatus().title}
        </p>
      )}

      <form className={styles.inputContainer} onSubmit={onSend}>
        {!isSnowflakeChat && showUploadFile && (
          <label htmlFor="attach_file" className={styles.attach}>
            <input
              type="file"
              style={{ display: "none" }}
              id="attach_file"
              multiple
              accept=".doc, .docx, .xls, .xlsx, .pdf, .csv"
              disabled={isStreaming}
              onChange={onFileUpload}
            />
            <AttachFileRoundedIcon />
          </label>
        )}

        <div className={styles.input}>
          {replyMessage && (
            <ReplyState
              message={replyMessage.text}
              onClearReply={clearReplyMessage}
            />
          )}

          {files?.length > 0 && <UploadFiles files={files} chatId={chatId} />}
          <textarea
            ref={textareaRef}
            id="input-message"
            placeholder="Ask anything..."
            value={text}
            onChange={onTexting}
            disabled={
              isStreaming ||
              (isSnowflakeChat &&
                snowflakeConnectionStatus !== connectionStatuses.CONNECTED)
            }
            onKeyDown={handleKeyPress}
            autoComplete="off"
            rows={1}
          />
        </div>

        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!isStreaming && disabled}
          style={{
            opacity: disabled ? 0.5 : 1
          }}
        >
          {isStreaming ? <PauseCircleOutlineRoundedIcon /> : <SendIcon />}
        </button>
      </form>
    </>
  );
};

export default Input;
