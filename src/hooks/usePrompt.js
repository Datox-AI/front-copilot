import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { queryClient } from "../config/queryClient";
import moment from "moment";
import { arrayUniqueByKey, makeLowerCase } from "../utils";
import {
  createTextGenerator,
  destroyTextGenerator,
  setTextToGenerator,
  startStreaming,
  stopStreaming
} from "../redux/chat/chatSlice";

const authorizationKey = "mGXWZKWNIDa5BEm8QvpTg+36AIpAA+6HfitgGTZHYus=";

const usePrompt = ({ chatId, refetchMessages, listRef, setRelatedFiles }) => {
  const dispatch = useDispatch();
  const textGenerator = useSelector(
    (store) => store.chat.textGenerator[chatId]
  );
  const { token } = useSelector((store) => store.auth);

  const [questions, setQuestions] = useState([]);

  const updateLastMessage = (text) => {
    const _cachedMsgs = [
      ...queryClient.getQueryData(["GET_MESSAGES", chatId])?.lists
    ];

    const lastIndex = _cachedMsgs.length - 1;

    _cachedMsgs[lastIndex] = {
      ..._cachedMsgs[lastIndex],
      text,
      isTyping: true
    };

    queryClient.setQueryData(["GET_MESSAGES", chatId], {
      lists: [..._cachedMsgs]
    });
  };

  useEffect(() => {
    setQuestions([]);

    if (setRelatedFiles) setRelatedFiles([]);
  }, [chatId]);

  useEffect(() => {
    if (!textGenerator || !textGenerator?.isStreaming) return;

    updateLastMessage(textGenerator.text);

    return () => {
      // clean text generator
      if (!textGenerator.isStreaming) dispatch(stopStreaming({ chatId }));
    };
  }, [chatId, textGenerator]);

  const onText = (text) => {
    dispatch(setTextToGenerator({ chatId, text }));
    // updateLastMessage(text);
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

  const onError = () => {};

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
        onError();
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

              return;
            }

            if (!isStreaming) {
              refetchMessages();
              reader.cancel();

              return;
            }

            dataString += decoder.decode(value);

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
    [chatId]
  );

  const fetchStream = (message) => {
    const formData = new FormData();

    formData.append("Prompt", message);

    let newMSG = {
      prompt: "",
      created: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      response: "",
      files: [],
      text: " ",
      role: "Assistant"
    };

    const _cachedMsgs = [
      ...queryClient.getQueryData(["GET_MESSAGES", chatId])?.lists
    ];

    queryClient.setQueryData(["GET_MESSAGES", chatId], {
      lists: [..._cachedMsgs, { ...newMSG }]
    });

    fetch(
      `https://copilotwebapi.azurewebsites.net/api/chats/${chatId}/messages`,
      {
        method: "POST",
        headers: {
          ApiKey: `${authorizationKey}`,
          Authorization: "Bearer " + token
        },
        body: formData
      }
    )
      .then((res) => onFetchSuccess(res, message))
      .catch((err) => {
        console.log(err);
      });
  };

  const startPrompting = (text) => {
    // creating mock message before fetching
    let newMSG = {
      prompt: text,
      created: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      response: "",
      files: [],
      text,
      role: "User"
    };

    const _cachedMsgs = [
      ...queryClient.getQueryData(["GET_MESSAGES", chatId])?.lists
    ];

    queryClient.setQueryData(["GET_MESSAGES", chatId], {
      lists: [..._cachedMsgs, { ...newMSG }]
    });

    if (listRef.current) {
      listRef?.current.scrollIntoView({
        block: "end"
      });
    }

    setQuestions([]);
    dispatch(createTextGenerator({ chatId }));
    fetchStream(text);
  };

  return { startPrompting, questions };
};

export default usePrompt;
