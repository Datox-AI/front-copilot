import { useMutation, useQuery } from "react-query";
import { request } from "../../config/request";

const useChatsAPI = ({ isGetUsers = false, userId, chatId }) => {
  const { data, isLoading, refetch } = useQuery(
    ["GET_CHATS", userId],
    async () => await request.get(`/api/chats${userId ? `/${userId}` : ""}`),
    {
      enabled: !!isGetUsers
    }
  );

  const {
    data: selectedChat,
    isLoading: isLoadingChat,
    refetch: refetchChat
  } = useQuery(
    ["GET_CHAT", userId, chatId],
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
      enabled: !!chatId
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
    refetch,
    selectedChat,
    isLoadingChat,
    generateChatName,
    refetchChat,
    singleChat,
    isLoadingSingleChat,
    refetchSingleChat,
    createChat,
    deleteChat,
    updateChat,
    updateSnowflakeData
  };
};

export default useChatsAPI;
