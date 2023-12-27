import styles from "./style.module.scss";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import { ReactComponent as SendIcon } from "../../../../assets/icons/PaperPlaneRight.svg";
import ReplyState from "./States/Reply";
import { useSelector } from "react-redux";
import UploadFiles from "./States/UploadFiles";

const Input = ({
  chatId,
  text,
  disabled,
  onSend,
  onTexting,
  isStreaming,
  replyMessage,
  onFileUpload,
  clearReplyMessage,
  onCancel
}) => {
  const files = useSelector((store) => store.chat.files[chatId]);

  return (
    <form className={styles.inputContainer} onSubmit={onSend}>
      <label htmlFor="attach_file" className={styles.attach}>
        <input
          type="file"
          style={{ display: "none" }}
          id="attach_file"
          multiple
          disabled={isStreaming}
          onChange={onFileUpload}
        />
        <AttachFileRoundedIcon />
      </label>

      <div className={styles.input}>
        {replyMessage && (
          <ReplyState
            message={replyMessage.text}
            onClearReply={clearReplyMessage}
          />
        )}

        {files?.length > 0 && <UploadFiles files={files} chatId={chatId} />}
        <input
          id="input-message"
          placeholder="Ask anything..."
          value={text}
          onChange={onTexting}
          disabled={isStreaming}
          autoComplete="off"
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
