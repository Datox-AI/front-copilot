import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useUpdateAssistantFileAPI({ assistantId }) {
  return useMutation((data) =>
    request.patch(
      `api/assistants/update-assistant-files/${assistantId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  );
}
