import { useMsal } from "@azure/msal-react";
import useChatsAPI from "./api/useChatsAPI";
import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";

export const chatModes = {
  CHAT: "CHAT",
  SELECT: "SELECT"
};

const useMessages = ({ activeChat, refetch, data, chatId, listRef }) => {
  const oneTimeRenderRef = useRef(null);

  const { generateChatName } = useChatsAPI({});

  useEffect(() => {
    if (!data || !activeChat) return;
    if (data.length > 2) return;
    if (activeChat?.name !== "New Chat") return;

    generateChatName.mutate(activeChat?.id, {
      onSuccess: () => refetch()
    });
  }, [data, activeChat]);

  useEffect(() => {
    oneTimeRenderRef.current = false;
  }, [chatId]);

  useEffect(() => {
    if (!oneTimeRenderRef.current && data?.length > 0) {
      listRef.current?.scrollIntoView({
        block: "end"
      });

      oneTimeRenderRef.current = true;
    }
  }, [data, chatId, oneTimeRenderRef.current]);

  const groupedMessages = useMemo(() => {
    if (!data || data?.length === 0) return [];

    // Group messages by date
    const groups = data.reduce((groups, message) => {
      const date = message.created_at.split("T")[0];
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
