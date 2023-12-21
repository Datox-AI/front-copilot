import styles from "./style.module.scss";
import classNames from "classnames";
import CustomMarkdown from "./CustomMarkdown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../../../utils";
import QuestionsList from "./QuestionsList";
import MoreCommands from "./MoreCommands";

const MessageItem = ({
  time,
  isBot,
  chatId,
  message,
  refetch,
  isPinned,
  questions,
  messageId,
  author_fullname,
  onSelectQuestion
}) => {
  return (
    <div
      id={`message-${messageId}`}
      className={classNames(styles.container, {
        [styles.isBot]: isBot
      })}
    >
      <div className={styles.author}>
        {<Avatar {...stringAvatar(isBot ? "Datox GPT" : author_fullname)} />}
      </div>
      <div className={styles.content}>
        <p className={styles.message}>
          <MoreCommands
            chatId={chatId}
            refetch={refetch}
            message={message}
            isPinned={isPinned}
            messageId={messageId}
          />
          <CustomMarkdown message={message} />
          {questions && questions.length > 0 && (
            <QuestionsList
              questions={questions}
              onSelectQuestion={onSelectQuestion}
            />
          )}
        </p>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
};

export default MessageItem;
