import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useCreateAssistantAPI() {
  return useMutation(
    (data) => request.post("api/assistants/create-assistant", data),
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}
