import styles from "./style.module.scss";
import classNames from "classnames";
import CustomMarkdown from "./CustomMarkdown";
import QuestionsList from "./QuestionsList";
import MoreCommands from "./MoreCommands";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { Avatar, Box, Button, Checkbox } from "@mui/material";
import { stringAvatar } from "../../../../../utils";
import { chatModes } from "../../../../../hooks/useMessages";
import File from "../../../../../components/File";
import Dots from "../../../../../components/Dots";
import { Link } from "react-router-dom";
import { useState } from "react";

const ReplyMessage = ({ onClickReply, replyMessage }) => {
  return (
    <div className={styles.reply} onClick={() => onClickReply(replyMessage.id)}>
      <p>{replyMessage?.text}</p>
    </div>
  );
};

const MessageItem = ({
  time,
  mode,
  isBot,
  chatId,
  message,
  gptIcon,
  isAudit,
  refetch,
  onClick,
  isPinned,
  questions,
  messageId,
  files,
  onReply,
  replyMessage,
  author_fullname,
  onSelectQuestion,
  isAssistantConfig,
  toggleMessage,
  isSelected,
  fullData,
  showDots,
  isHighlightedMessage,
  onHighlightMessage,
  storeFileId,
  sqlQuery,
  referenceFiles,
  setReferenceFiles
}) => {
  const [showSqlQueries, setShowSqlQueries] = useState(false);

  const onClickReply = (_id) => {
    document.getElementById("message-" + _id).scrollIntoView({
      block: "start"
    });
    onHighlightMessage(_id);
  };

  const avatarAttributes = stringAvatar(isBot ? "Datox GPT" : author_fullname);

  return (
    <div
      id={`message-${messageId}`}
      onClick={onClick}
      className={classNames(styles.container, {
        [styles.isBot]: isBot,
        [styles.isSelected]: isSelected,
        [styles.isHighlighted]: isHighlightedMessage === messageId,
        [styles.isAssistantConfig]: isAssistantConfig
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
          {isBot && gptIcon ? (
            <img
              src={gptIcon}
              width={isAssistantConfig ? 26 : 42}
              height={isAssistantConfig ? 26 : 42}
              style={{
                objectFit: "cover",
                borderRadius: "30px"
              }}
            />
          ) : (
            <Avatar
              {...avatarAttributes}
              sx={{
                ...avatarAttributes.sx,
                height: isAssistantConfig ? 26 : 42,
                width: isAssistantConfig ? 26 : 42
              }}
            />
          )}
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
              <ReplyMessage
                replyMessage={replyMessage}
                onClickReply={onClickReply}
              />
            )}

            {files?.length > 0 && (
              <Box className={styles.filesBox}>
                {files.map((file) => (
                  <File name={file.fileName} type={file.fileType} />
                ))}
              </Box>
            )}

            {!isAssistantConfig && showDots && <Dots />}

            <CustomMarkdown message={message} />

            {!isAssistantConfig && sqlQuery && (
              <button
                className={styles.sqlToggler}
                onClick={() => setShowSqlQueries((prev) => !prev)}
              >
                {showSqlQueries ? "Less" : "Show"} query {"</>"}
              </button>
            )}

            {!isAssistantConfig && referenceFiles?.length > 0 && (
              <button
                className={styles.sqlToggler}
                onClick={() => setReferenceFiles(referenceFiles)}
              >
                Show references
              </button>
            )}

            {showSqlQueries && <CustomMarkdown message={sqlQuery} />}

            {questions && questions.length > 0 && (
              <QuestionsList
                questions={questions}
                onSelectQuestion={onSelectQuestion}
              />
            )}

            {!isAssistantConfig && storeFileId && (
              <Link
                to={`/integration/2/${chatId}/store/${storeFileId}`}
                style={{
                  textDecoration: "none"
                }}
              >
                <Button
                  style={{
                    marginTop: "10px"
                  }}
                  variant="outlined"
                >
                  Show Data
                </Button>
              </Link>
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
