import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

import MessageItem from "./MessageItem";
import styles from "./style.module.scss";
import moment from "moment";
import useChatsAPI from "../../../../hooks/api/useChatsAPI";
import MessageItemSkeleton from "./MessageItem/index.skeleton";
import { useMsal } from "@azure/msal-react";

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
      isStreaming
    },
    listRef
  ) => {
    const { accounts } = useMsal();
    const { generateChatName } = useChatsAPI({});

    useEffect(() => {
      if (!data || !activeChat) return;
      if (data.lists.length > 2) return;
      if (activeChat?.name !== "New Chat") return;

      generateChatName.mutate(activeChat?.id, {
        onSuccess: () => refetch()
      });
    }, [data, activeChat]);

    useEffect(() => {
      listRef.current?.lastElementChild?.scrollIntoView({
        block: "end"
      });
    }, [data?.lists, chatId]);

    const groupedMessages = useMemo(() => {
      if (!data || !data.lists) return [];

      // Group messages by date
      const groups = data.lists.reduce((groups, message) => {
        const date = message.created.split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
        return groups;
      }, {});

      const groupArrays = Object.keys(groups).map((date) => {
        return {
          date: moment(date).format("DD MMM yyyy"),
          messages: groups[date]
        };
      });

      return groupArrays;
    }, [data]);

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
          groupedMessages.map((block, b) => (
            <div className={styles.block} key={b}>
              <p>{block.date}</p>
              <div className={styles.messageList} ref={listRef}>
                {block.messages.map((message, m) => (
                  <MessageItem
                    key={m}
                    isBot={message.role === "Assistant"}
                    time={moment(message.created).format("hh:mm A")}
                    onSelectQuestion={onSelectQuestion}
                    isTyping={message.isTyping}
                    author_fullname={
                      message.role === "Assistant"
                        ? "Datox GPT"
                        : accounts?.[0]?.name || "DATOX USER"
                    }
                    message={
                      message.text || (!isStreaming ? errorEmptyMessage : "")
                    }
                    questions={
                      b === groupedMessages.length - 1 &&
                      m === block.messages.length - 1 &&
                      questions
                    }
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
);

export default Messages;
