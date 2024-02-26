import styles from "./style.module.scss";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import ReplyState from "./States/Reply";
import UploadFiles from "./States/UploadFiles";

import { ReactComponent as SendIcon } from "../../../../assets/icons/PaperPlaneRight.svg";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ConnectionStatuses from "./ConnectionStatuses";

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
  isAgentConnected,
  clearReplyMessage,
  onCancel,
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

  return (
    <form className={styles.inputContainer} onSubmit={onSend}>
      {!isSnowflakeChat ? (
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
      ) : (
        <ConnectionStatuses status={snowflakeConnectionStatus} />
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
          disabled={isStreaming}
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
  );
};

export default Input;
