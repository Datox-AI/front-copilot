import moment from "moment";
import toast from "react-hot-toast";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { queryClient } from "../config/queryClient";
import { arrayUniqueByKey, focusOnInput, makeLowerCase } from "../utils";
import {
  clearFiles,
  createTextGenerator,
  destroyTextGenerator,
  setTextToGenerator,
  startStreaming,
  stopStreaming
} from "../redux/chat/chatSlice";
import { BASE_API_URL, COPILOT_API_KEY } from "../config/request";

const usePrompt = ({ chatId, refetchMessages, listRef, setRelatedFiles }) => {
  const dispatch = useDispatch();
  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );
  const files = useSelector((store) => store.chat.files[chatId]);

  const { token } = useSelector((store) => store.auth);

  const [questions, setQuestions] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);

  const scrollToTheEndOfTheChat = useCallback(() => {
    listRef?.current?.scrollIntoView({
      block: "end"
    });
  }, [listRef]);

  const clearReplyMessage = () => setReplyMessage(null);

  const updateLastMessage = (text) => {
    const _cachedMsgs = [
      ...(queryClient?.getQueryData(["GET_MESSAGES", chatId]) || [])
    ];

    const lastIndex = _cachedMsgs.length - 1;

    _cachedMsgs[lastIndex] = {
      ..._cachedMsgs[lastIndex],
      text,
      isTyping: true
    };

    queryClient.setQueryData(["GET_MESSAGES", chatId], [..._cachedMsgs]);
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
    scrollToTheEndOfTheChat();
  };

  const onSearchFiles = (_files) => {
    setRelatedFiles((prev) => {
      const allFiles = [...prev, ..._files];
      const lowerCasedFiles = makeLowerCase(allFiles);

      return arrayUniqueByKey(lowerCasedFiles, "itemUrl");
    });
  };

  const onQuestions = (qstns) => {
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

  const fetchStream = (message) => {
    let newMSG = {
      prompt: "",
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      response: "",
      files: [],
      replyTo: null,
      text: " ",
      role: "Assistant"
    };

    const _cachedMsgs = [
      ...(queryClient.getQueryData(["GET_MESSAGES", chatId]) || [])
    ];

    queryClient.setQueryData(
      ["GET_MESSAGES", chatId],
      [..._cachedMsgs, { ...newMSG }]
    );

    dispatch(clearFiles({ chatId }));

    fetch(`${BASE_API_URL}api/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        ApiKey: COPILOT_API_KEY,
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: message,
        replyTo: replyMessage?.id,
        files: [...(files || []).map((file) => file.fileId)]
      })
    })
      .then((res) => onFetchSuccess(res, message))
      .catch((err) => {
        console.log(err);
      });
  };

  const startPrompting = (text) => {
    // creating mock message before fetching
    let newMSG = {
      prompt: text,
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      response: "",
      files: [
        ...(files || []).map((file) => ({
          fileName: file.file.name,
          fileType:
            file.file.name.split(".")[file.file.name.split(".").length - 1]
        }))
      ],
      replyTo: replyMessage?.id,
      text,
      role: "User"
    };

    const _cachedMsgs = [
      ...(queryClient.getQueryData(["GET_MESSAGES", chatId]) || [])
    ];

    queryClient.setQueryData(
      ["GET_MESSAGES", chatId],
      [..._cachedMsgs, { ...newMSG }]
    );

    setQuestions([]);
    setReplyMessage(null);
    dispatch(createTextGenerator({ chatId }));
    scrollToTheEndOfTheChat();
    fetchStream(text);
  };

  return {
    startPrompting,
    questions,
    replyMessage,
    clearReplyMessage,
    selectReplyMessage: setReplyMessage
  };
};

export default usePrompt;
