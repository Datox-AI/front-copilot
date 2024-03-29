import { useQuery } from "react-query";
import { request } from "../../config/request";

export default function useGetAssistantAPI({
  params,
  queryParams,
  assistantId
}) {
  return useQuery(
    ["GET_ASSISTANTS", assistantId],
    () =>
      request.get(`api/assistants/get-assistant/${assistantId}`, {
        ...params
      }),
    {
      ...queryParams
    }
  );
}
