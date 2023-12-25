import styles from "./style.module.scss";
import { ReactComponent as ReplyIcon } from "../../../../../../assets/icons/reply.svg";
import { ReactComponent as TrashIcon } from "../../../../../../assets/icons/trash.svg";
import { useState } from "react";

const ReplyState = ({ message, onClearReply }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.replyState}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.icon}>
        {isHovered ? <TrashIcon onClick={onClearReply} /> : <ReplyIcon />}
      </div>

      <div className={styles.message}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ReplyState;
