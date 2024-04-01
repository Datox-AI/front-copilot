import { useQuery } from "react-query";
import { request } from "../../config/request";

export default function useGetAssistantChatsAPI({
  params,
  queryParams,
  assistantId
}) {
  return useQuery(
    ["GET_ASSISTANTS_CHATS", assistantId],
    () =>
      request.get(`api/assistants/get-assistant-chats/${assistantId}`, {
        ...params
      }),
    {
      ...queryParams
    }
  );
}
