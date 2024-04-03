import { useMutation } from "react-query";
import { request } from "../../config/request";

export default function useDownloadAssistanFile() {
  return useMutation(({ assistantId, data }) =>
    request.post(
      "api/assistants/download-knowledge_file/" + assistantId,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
  );
}
