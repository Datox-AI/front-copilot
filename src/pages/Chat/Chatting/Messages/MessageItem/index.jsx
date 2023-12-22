import styles from "./style.module.scss";
import classNames from "classnames";
import CustomMarkdown from "./CustomMarkdown";
import QuestionsList from "./QuestionsList";
import MoreCommands from "./MoreCommands";

import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../../../utils";

const MessageItem = ({
  time,
  isBot,
  chatId,
  message,
  isAudit,
  refetch,
  onClick,
  isPinned,
  questions,
  messageId,
  author_fullname,
  onSelectQuestion,
  toggleMessage,
  isSelected,
  fullData
}) => {
  return (
    <div
      id={`message-${messageId}`}
      onClick={onClick}
      className={classNames(styles.container, {
        [styles.isBot]: isBot,
        [styles.isSelected]: isSelected
      })}
    >
      <div className={styles.author}>
        {<Avatar {...stringAvatar(isBot ? "Datox GPT" : author_fullname)} />}
      </div>
      <div className={styles.content}>
        <p className={styles.message}>
          {!isAudit && (
            <MoreCommands
              chatId={chatId}
              refetch={refetch}
              message={fullData}
              isPinned={isPinned}
              messageId={messageId}
              isSelected={isSelected}
              toggleMessage={toggleMessage}
            />
          )}
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
