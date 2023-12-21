import { useMsal } from "@azure/msal-react";
import useChatsAPI from "./api/useChatsAPI";
import { useEffect, useMemo } from "react";
import moment from "moment";

const useMessages = ({ activeChat, refetch, data, chatId, listRef }) => {
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
    listRef.current?.scrollIntoView({
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

  return {
    messages: groupedMessages
  };
};

export default useMessages;
