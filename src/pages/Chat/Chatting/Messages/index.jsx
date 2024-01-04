import MessageItem from "./MessageItem";
import styles from "./style.module.scss";
import moment from "moment";
import MessageItemSkeleton from "./MessageItem/index.skeleton";
import useMessages, { chatModes } from "../../../../hooks/useMessages";

import { forwardRef } from "react";
import { useMsal } from "@azure/msal-react";
import { focusOnInput } from "../../../../utils";

const errorEmptyMessage = "Something wrong with response prompt";

const Messages = forwardRef(
  (
    {
      data,
      mode,
      chatId,
      isAudit,
      questions,
      onSelectQuestion,
      activeChat,
      refetch,
      isLoading,
      refetchMessages,
      isStreaming,
      selectedMessages,
      selectReplyMessage,
      toggleMessage,
      onHighlightMessage,
      isHighlightedMessage
    },
    listRef
  ) => {
    const { accounts } = useMsal();
    const { messages } = useMessages({
      activeChat,
      refetch,
      data,
      listRef,
      chatId
    });

    const onReply = (message) => {
      selectReplyMessage(message);
      focusOnInput();
    };

    return (
      <div className={styles.messages}>
        {isLoading ? (
          <div className={styles.block}>
            <div className={styles.messageList} ref={listRef}>
              {Array(4)
                .fill(4)
                .map((item, idx) => (
                  <MessageItemSkeleton key={idx} isBot={idx % 2 !== 0} />
                ))}
            </div>
          </div>
        ) : (
          messages.map((block, b) => (
            <div className={styles.block} key={b}>
              <p className={styles.date}>{block.date}</p>
              <div className={styles.messageList}>
                {block.messages.map((message, m) => {
                  const isLastMessage =
                    messages.length - 1 === b &&
                    block.messages.length - 1 === m - 1;

                  const realMessage =
                    message.text ||
                    (!isStreaming
                      ? errorEmptyMessage
                      : !isLastMessage
                      ? errorEmptyMessage
                      : "");

                  const realQuestions =
                    b === messages.length - 1 &&
                    m === block.messages.length - 1 &&
                    (questions.length > 0 ? questions : message.questions);

                  const author =
                    message.role === "Assistant"
                      ? "Datox GPT"
                      : accounts?.[0]?.name || "DATOX USER";

                  return (
                    <MessageItem
                      key={m}
                      mode={mode}
                      isAudit={isAudit}
                      chatId={chatId}
                      refetch={refetchMessages}
                      isHighlightedMessage={isHighlightedMessage}
                      isBot={message.role === "Assistant"}
                      time={moment(message.created).format("hh:mm A")}
                      onSelectQuestion={onSelectQuestion}
                      isSelected={selectedMessages.includes(message.id)}
                      onReply={() => onReply(message)}
                      toggleMessage={() => toggleMessage(message.id)}
                      isTyping={message.isTyping}
                      messageId={message.id}
                      isPinned={message.pinned}
                      fullData={message}
                      onHighlightMessage={onHighlightMessage}
                      author_fullname={author}
                      message={realMessage}
                      files={message.files}
                      showDots={!realMessage.trim()}
                      questions={!isAudit && realQuestions}
                      replyMessage={data?.lists?.find(
                        (msg) => msg.id === message.replyTo
                      )}
                      onClick={
                        mode === chatModes.SELECT
                          ? () => toggleMessage(message.id)
                          : () => {}
                      }
                    />
                  );
                })}
                <div
                  ref={listRef}
                  style={{
                    padding: "10px 0"
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
);

export default Messages;
