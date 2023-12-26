import styles from "./style.module.scss";
import classNames from "classnames";
import CustomMarkdown from "./CustomMarkdown";
import QuestionsList from "./QuestionsList";
import MoreCommands from "./MoreCommands";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { Avatar, Box, Checkbox } from "@mui/material";
import { stringAvatar } from "../../../../../utils";
import { chatModes } from "../../../../../hooks/useMessages";

const MessageItem = ({
  time,
  mode,
  isBot,
  chatId,
  message,
  isAudit,
  refetch,
  onClick,
  isPinned,
  questions,
  messageId,
  onReply,
  replyMessage,
  author_fullname,
  onSelectQuestion,
  toggleMessage,
  isSelected,
  fullData
}) => {
  const onClickReply = (_id) => {
    document.getElementById("message-" + _id).scrollIntoView({
      block: "start"
    });
  };

  return (
    <div
      id={`message-${messageId}`}
      onClick={onClick}
      className={classNames(styles.container, {
        [styles.isBot]: isBot,
        [styles.isSelected]: isSelected
      })}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        gap="8px"
        flexDirection={isBot ? "row" : "row-reverse"}
        width="95%"
      >
        <div className={styles.author}>
          {mode === chatModes.SELECT && isBot && (
            <Checkbox
              value={isSelected}
              checked={isSelected}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
          )}
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
                onReply={onReply}
              />
            )}
            {replyMessage?.id && (
              <div
                className={styles.reply}
                onClick={() => onClickReply(replyMessage.id)}
              >
                <p>{replyMessage?.text}</p>
              </div>
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
      </Box>
      {mode === chatModes.SELECT && !isBot && (
        <Checkbox
          value={isSelected}
          checked={isSelected}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
        />
      )}
    </div>
  );
};

export default MessageItem;
