import { useMutation, useQuery } from "react-query";
import { request } from "../../config/request";

const useChatsAPI = ({
  isGetUsers = false,
  userId,
  chatId,
  chatType = "gpt"
}) => {
  const { data, isLoading, refetch, isFetching } = useQuery(
    ["GET_CHATS", userId],
    async () => await request.get(`/api/chats${userId ? `/${userId}` : ""}`),
    {
      enabled: !!isGetUsers
    }
  );

  const {
    data: singleChat,
    isLoading: isLoadingSingleChat,
    refetch: refetchSingleChat
  } = useQuery(
    ["GET_CHAT_HISTORY", chatId],
    async () => await request.get(`/api/chats/chat-history/${chatId}`),
    {
      enabled: !!chatId && chatType === "gpt"
    }
  );

  const {
    data: singleAnalyticsChat,
    isLoading: isLoadingSingleAnalyticsChat,
    refetch: refetchSingleAnalyticsChat
  } = useQuery(
    ["GET_ANALYTICS_CHAT_HISTORY", chatId],
    async () => await request.get(`/api/analytics_agent/${chatId}/messages`),
    {
      enabled: !!chatId && chatType === "DataAnalytics"
    }
  );

  const {
    data: singleRagChat,
    isLoading: isLoadingSingleRagChat,
    refetch: refetchSingleRagChat
  } = useQuery(
    ["GET_RAG_CHAT_HISTORY", chatId],
    async () => await request.get(`/api/rag_agent/${chatId}/messages`),
    {
      enabled: !!chatId && chatType === "FileSearch"
    }
  );

  const createChat = useMutation((data) =>
    request.post("/api/chats", { ...data })
  );

  const updateChat = useMutation((data) =>
    request.put("/api/chats/" + data.id, data.body)
  );

  const updateSnowflakeData = useMutation((data) =>
    request.put("/api/chats/snowflake-data/" + data.id, data.body)
  );

  const deleteChat = useMutation((id) => request.delete("/api/chats/" + id));

  const generateChatName = useMutation((id) =>
    request.put(`/api/chats/${id}/generate-name`)
  );

  return {
    data,
    isLoading,
    isFetching,
    refetch,
    singleAnalyticsChat,
    isLoadingSingleAnalyticsChat,
    refetchSingleAnalyticsChat,
    generateChatName,
    singleChat,
    isLoadingSingleChat,
    refetchSingleChat,
    createChat,
    deleteChat,
    updateChat,
    updateSnowflakeData,
    singleRagChat,
    isLoadingSingleRagChat,
    refetchSingleRagChat
  };
};

export default useChatsAPI;
