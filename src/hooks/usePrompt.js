import moment from "moment";
import toast from "react-hot-toast";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { queryClient } from "../config/queryClient";
import { arrayUniqueByKey, focusOnInput, makeLowerCase } from "../utils";
import {
  // clearFiles,
  createTextGenerator,
  destroyTextGenerator,
  setQuestionsToGenerator,
  setTextToGenerator,
  startStreaming,
  stopStreaming
} from "../redux/chat/chatSlice";
import { request } from "../config/request";

const usePrompt = ({
  chatId,
  refetchMessages,
  listRef,
  setRelatedFiles,
  isAgentConnected,
  sendMessageToAgent,
  isRagType,
  files,
  assistantId,
  clearFiles,
  activeIntegration
}) => {
  const dispatch = useDispatch();
  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );
  // const files = useSelector((store) => store.chat.files[chatId]);

  const { token } = useSelector((store) => store.auth);

  const [questions, setQuestions] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);

  const scrollToTheEndOfTheChat = useCallback(() => {
    listRef?.current?.scrollIntoView({
      block: "end",
      behavior: "smooth"
    });
  }, [listRef]);

  const clearReplyMessage = () => setReplyMessage(null);

  const getCachedMessages = useCallback(() => {
    let _cachedMsgs;

    switch (activeIntegration?.dataType) {
      case "FileSearch":
        _cachedMsgs = [
          ...(queryClient.getQueryData(["GET_RAG_CHAT_HISTORY", chatId])
            ?.messages || [])
        ];
        break;

      case "DataAnalytics":
        _cachedMsgs = [
          ...(queryClient.getQueryData(["GET_ANALYTICS_CHAT_HISTORY", chatId])
            ?.messages || [])
        ];
        break;

      case "Assistant":
        _cachedMsgs = [
          ...(queryClient.getQueryData(["GET_ASSISTANTS_CHAT_MESSAGES", chatId])
            ?.messages || [])
        ];
        break;

      default:
        _cachedMsgs = [
          ...(queryClient.getQueryData(["GET_MESSAGES", chatId]) || [])
        ];
        break;
    }

    return _cachedMsgs;
  }, [chatId]);

  const pushToCachedMessages = useCallback(
    (elements) => {
      switch (activeIntegration?.dataType) {
        case "FileSearch":
          queryClient.setQueryData(["GET_RAG_CHAT_HISTORY", chatId], {
            ...queryClient.getQueryData(["GET_RAG_CHAT_HISTORY", chatId]),
            messages: [...elements]
          });
          break;

        case "DataAnalytics":
          queryClient.setQueryData(["GET_ANALYTICS_CHAT_HISTORY", chatId], {
            ...queryClient.getQueryData(["GET_ANALYTICS_CHAT_HISTORY", chatId]),
            messages: [...elements]
          });
          break;
        case "Assistant":
          queryClient.setQueryData(["GET_ASSISTANTS_CHAT_MESSAGES", chatId], {
            ...queryClient.getQueryData([
              "GET_ASSISTANTS_CHAT_MESSAGES",
              chatId
            ]),
            messages: [...elements]
          });
          break;

        default:
          queryClient.setQueryData(["GET_MESSAGES", chatId], [...elements]);
          break;
      }
    },
    [chatId]
  );

  const updateLastMessage = (text, data = {}) => {
    const _cachedMsgs = [...getCachedMessages()];

    const lastIndex = _cachedMsgs.length - 1;

    _cachedMsgs[lastIndex] = {
      ..._cachedMsgs[lastIndex],
      text,
      isTyping: true,
      ...data
    };

    pushToCachedMessages(_cachedMsgs);

    scrollToTheEndOfTheChat();
  };

  useEffect(() => {
    focusOnInput();
    setQuestions([]);

    if (setRelatedFiles) setRelatedFiles([]);
  }, [chatId]);

  useEffect(() => {
    if (!textGenerator || !textGenerator?.isStreaming) return;

    if (textGenerator.text) updateLastMessage(textGenerator.text);

    return () => {
      // clean text generator
      if (!textGenerator.isStreaming) dispatch(stopStreaming({ chatId }));
    };
  }, [chatId, textGenerator]);

  const onText = (text) => {
    dispatch(setTextToGenerator({ chatId, text }));
  };

  const onSearchFiles = (_files) => {
    setRelatedFiles((prev) => {
      const allFiles = [...prev, ..._files];
      const lowerCasedFiles = makeLowerCase(allFiles);

      return arrayUniqueByKey(lowerCasedFiles, "itemUrl");
    });
  };

  const onQuestions = (qstns) => {
    dispatch(setQuestionsToGenerator({ chatId, questions: qstns }));
    setQuestions(qstns);
  };

  const onError = (err) => {
    toast.error(err);
  };

  const onParseTypes = (type, data) => {
    switch (type) {
      case "Text":
        onText(data.Text);
        break;

      case "SearchFiles":
        onSearchFiles(data.Files);
        break;

      case "Questions":
        onQuestions(data.Questions);
        break;

      case "Error":
        onError(data.Text);
        break;

      default:
        break;
    }
  };

  const onFetchSuccess = useCallback(
    (response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let dataString = "";

      dispatch(startStreaming({ chatId }));

      function read() {
        return reader
          .read()
          .then(({ done, value }) => {
            const { isStreaming } = store.getState().chat.textGenerator[chatId];

            if (done) {
              dispatch(stopStreaming({ chatId }));
              refetchMessages();
              scrollToTheEndOfTheChat();

              dispatch(destroyTextGenerator({ chatId }));
              return;
            }

            if (!isStreaming) {
              refetchMessages();
              scrollToTheEndOfTheChat();
              dispatch(destroyTextGenerator({ chatId }));
              reader.cancel();

              return;
            }

            dataString += decoder.decode(value);
            const str = decoder.decode(value);

            const _messages = dataString.split("\n\n");
            dataString = _messages.pop();

            _messages.forEach((message) => {
              const line = message.trim();

              if (!line.startsWith("data:")) return;

              const jsonString = line.substring(5).trim();
              const dataJSON = JSON.parse(jsonString);

              if (!dataJSON) return;

              onParseTypes(dataJSON.Type, dataJSON);
            });

            try {
              read();
            } catch (err) {
              console.log(err);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      read();
    },
    [chatId, listRef, scrollToTheEndOfTheChat]
  );

  const fetchStream = (message, uploadedFiles) => {
    let newMSG = {
      id: 2,
      prompt: "",
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      response: "",
      files: [],
      reply_to: null,
      text: " ",
      role: "Assistant"
    };
    let apiPath;

    if (isRagType) apiPath = "rag_agent";
    else if (!!assistantId) apiPath = `assistants/${assistantId}/chats`;
    else apiPath = "chats";

    const _cachedMsgs = [...getCachedMessages()];

    pushToCachedMessages([..._cachedMsgs, { ...newMSG }]);

    // dispatch(clearFiles({ chatId }))
    clearFiles();

    const formData = new FormData();

    formData.append("prompt", message);

    uploadedFiles?.forEach((file) => formData.append("files", file));

    const ragData = {
      prompt: message,
      replyTo: replyMessage?.id
    };

    // Messaging via websocket when agent connected
    if (isAgentConnected) sendMessageToAgent(message);
    else {
      request
        .post(
          `api/${apiPath}/${chatId}/messages`,
          isRagType ? ragData : formData,
          {
            headers: {
              "Content-Type": isRagType
                ? "application/json"
                : "multipart/form-data"
            }
          }
        )
        .then((res) => {
          updateLastMessage(res?.text, res);
        })
        .catch((err) => {
          console.log(err);

          if (err)
            toast.error(
              err.data?.detail || err.detail || "Something wrong happened"
            );
        })
        .finally(() => {
          dispatch(stopStreaming({ chatId }));
          refetchMessages();
        });
      // fetch(
      //   `${BASE_API_URL}api/${
      //     isRagType ? "rag_agent" : "chats"
      //   }/${chatId}/messages`,
      //   {
      //     method: "POST",
      //     headers: {
      //       // ApiKey: COPILOT_API_KEY,
      //       Authorization: "Bearer " + token
      //       // "Content-Type": "multipart/form-data"
      //     },
      //     // body: JSON.stringify({
      //     //   prompt: message,
      //     //   replyTo: replyMessage?.id,
      //     //   files: [...(files || []).map((file) => file.fileId)]
      //     // })
      //     body: JSON.stringify(formData)
      //   }
      // )
      //   .then((res) => onFetchSuccess(res, message))
      //   .catch((err) => {
      //     console.log(err);
      //     toast.error(err?.detail);
      //     dispatch(clearFiles({ chatId }));
      //   });
    }
  };

  const startPrompting = (text, uploadedFiles) => {
    // creating mock message before fetching
    let newMSG = {
      id: 1,
      prompt: text,
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      response: "",
      files: [
        ...(uploadedFiles || []).map((file) => ({
          fileName: file.name,
          fileType: file.name.split(".")[file.name.split(".").length - 1]
        }))
      ],
      reply_to: replyMessage?.id,
      text,
      role: "User"
    };

    const _cachedMsgs = [...getCachedMessages()];

    pushToCachedMessages([..._cachedMsgs, { ...newMSG }]);
    setQuestions([]);
    setReplyMessage(null);
    dispatch(createTextGenerator({ chatId }));
    fetchStream(text, uploadedFiles);
  };

  return {
    startPrompting,
    questions,
    replyMessage,
    scrollToTheEndOfTheChat,
    clearReplyMessage,
    onText,
    onQuestions,
    selectReplyMessage: setReplyMessage
  };
};

export default usePrompt;
