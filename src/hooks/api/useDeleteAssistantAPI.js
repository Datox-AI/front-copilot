import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useGetAssistantsAPI({ assistantId }) {
  return useMutation(() =>
    request.delete(`api/assistants/delete-assistant/${assistantId}`)
  );
}
