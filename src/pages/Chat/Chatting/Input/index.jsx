import styles from "./style.module.scss";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { ReactComponent as SendIcon } from "../../../../assets/icons/PaperPlaneRight.svg";
import { useMemo, useState } from "react";
import useMessagesAPI from "../../../../hooks/api/useMessagesAPI";
import usePrompt from "../../../../hooks/usePrompt";

const Input = ({ text, disabled, onSend, onTexting }) => {
  return (
    <form className={styles.inputContainer} onSubmit={onSend}>
      <label htmlFor="attach_file" className={styles.attach}>
        <input type="file" style={{ display: "none" }} id="attach_file" />
        <AttachFileRoundedIcon />
      </label>

      <input
        id="input-message"
        className={styles.input}
        placeholder="Ask anything..."
        value={text}
        onChange={onTexting}
      />

      <button
        type="submit"
        className={styles.sendBtn}
        disabled={disabled}
        style={{
          opacity: disabled ? 0.5 : 1
        }}
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default Input;
