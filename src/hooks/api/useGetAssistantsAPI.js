import { useQuery } from "react-query";
import { request } from "../../config/request";

export default function useGetAssistantsAPI({ params, queryParams }) {
  return useQuery(
    ["GET_ASSISTANTS"],
    () => request.get("api/assistants/get-assistants", { ...params }),
    {
      ...queryParams
    }
  );
}
