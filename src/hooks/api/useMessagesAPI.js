import { useMutation, useQuery } from "react-query";
import { request } from "../../config/request";

const getMessages = (chatId) => request.get(`/api/chats/${chatId}/messages`);
const pinMessage = (data, chatId) =>
  request.put(`/api/chats/${chatId}/messages/${data.id}`, { ...data.body });
const unpinMessage = (data, chatId) =>
  request.put(`/api/chats/${chatId}/messages/${data.id}`, { ...data.body });
const deleteMessage = (data, chatId) =>
  request.delete(`/api/chats/${chatId}/messages/batch`, { data });
const sendMessage = (data, chatId) =>
  request.post(`/api/chats/${chatId}/messages`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

const useMessagesAPI = ({ chatId }) => {
  const { data, isLoading, refetch } = useQuery(
    ["GET_MESSAGES", chatId],
    async () => await getMessages(chatId),
    {
      enabled: !!chatId
    }
  );

  const pinMutation = useMutation((data) => pinMessage(data, data.chatId));
  const unpinMutation = useMutation((data) => unpinMessage(data, data.chatId));
  const deleteMutation = useMutation((data) =>
    deleteMessage(data.body, data.chatId)
  );
  const sendMutation = useMutation((data) => sendMessage(data, chatId));

  return {
    data,
    isLoading,
    refetch,
    pinMutation,
    unpinMutation,
    deleteMutation,
    sendMutation
  };
};

export default useMessagesAPI;
