import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

import MessageItem from "./MessageItem";
import styles from "./style.module.scss";
import moment from "moment";
import useChatsAPI from "../../../../hooks/api/useChatsAPI";
import MessageItemSkeleton from "./MessageItem/index.skeleton";
import { useMsal } from "@azure/msal-react";
import useMessages from "../../../../hooks/useMessages";

const errorEmptyMessage = "Something wrong with response prompt";

const Messages = forwardRef(
  (
    {
      data,
      chatId,
      questions,
      onSelectQuestion,
      activeChat,
      refetch,
      isLoading,
      refetchMessages,
      isStreaming
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
              <p>{block.date}</p>
              <div className={styles.messageList}>
                {block.messages.map((message, m) => {
                  const realMessage =
                    message.text || (!isStreaming ? errorEmptyMessage : "");

                  const realQuestions =
                    b === messages.length - 1 &&
                    m === block.messages.length - 1 &&
                    questions;

                  const author =
                    message.role === "Assistant"
                      ? "Datox GPT"
                      : accounts?.[0]?.name || "DATOX USER";
                  return (
                    <MessageItem
                      key={m}
                      chatId={chatId}
                      refetch={refetchMessages}
                      isBot={message.role === "Assistant"}
                      time={moment(message.created).format("hh:mm A")}
                      onSelectQuestion={onSelectQuestion}
                      isTyping={message.isTyping}
                      messageId={message.id}
                      isPinned={message.pinned}
                      author_fullname={author}
                      message={realMessage}
                      questions={realQuestions}
                    />
                  );
                })}
                <div ref={listRef}></div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
);

export default Messages;
