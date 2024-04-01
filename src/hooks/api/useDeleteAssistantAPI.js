import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useDeleteAssistantAPI({ assistantId }) {
  return useMutation(() =>
    request.delete(`api/assistants/delete-assistant/${assistantId}`)
  );
}
