import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useCreateAssistantMessageAPI({ assistantId, chatId }) {
  return useMutation((data) =>
    request.post(`api/assistants/${assistantId}/chats/${chatId}/messages`, data)
  );
}
