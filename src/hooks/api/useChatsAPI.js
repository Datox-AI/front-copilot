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

  const createChat = useMutation((type) =>
    request.post("/api/chats", { type })
  );

  const updateChat = useMutation((data) =>
    request.put("/api/chats/" + data.id, data.body)
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
    createChat,
    deleteChat,
    updateChat
  };

  return;
};

export default useChatsAPI;
