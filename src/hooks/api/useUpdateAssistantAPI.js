import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useUpdateAssistantAPI({ assistantId }) {
  return useMutation((data) =>
    request.patch(`api/assistants/update-assistant/${assistantId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  );
}
