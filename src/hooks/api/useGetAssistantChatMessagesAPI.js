import { useQuery } from "react-query";
import { request } from "../../config/request";

export default function useGetAssistantChatMessagesAPI({
  chatId,
  params,
  assistantId,
  queryParams
}) {
  return useQuery(
    ["GET_ASSISTANTS_CHAT_MESSAGES", chatId],
    () =>
      request.get(`api/assistants/${assistantId}/chats/${chatId}/messages`, {
        ...params
      }),
    {
      ...queryParams
    }
  );
}
