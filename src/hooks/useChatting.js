import useFileUpload from "./useFileUpload";

import { useCallback, useEffect, useMemo, useState } from "react";
import { arrayUniqueByKey } from "../utils";
import { useDispatch } from "react-redux";
import { chatModes } from "./useMessages";
import useMessagesAPI from "./api/useMessagesAPI";
import toast from "react-hot-toast";

const useChatting = ({ chatId, data, startPrompting }) => {
  const dispatch = useDispatch();

  const { handleUpload } = useFileUpload({ chatId });

  const [text, setText] = useState("");
  const [mode, setMode] = useState(chatModes);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isHighlightedMessage, setIsHiglightedMessage] = useState(null);

  const {
    data,
    refetch: refetchMessages,
    isLoading,
    deleteMutation
  } = useMessagesAPI({ chatId });

  const onHighlightMessage = (msg) => setIsHiglightedMessage(msg);

  useEffect(() => {
    if (!isHighlightedMessage) return;

    const interval = setInterval(() => setIsHiglightedMessage(null), 2000);

    return () => {
      clearInterval(interval);
    };
  }, [isHighlightedMessage]);

  const pinnedMessages = useMemo(() => {
    if (!data || !data.lists) return [];

    return data.lists.filter((message) => message.pinned);
  }, [data]);

  const clearAllSelectedMessages = () => {
    setSelectedMessages([]);
  };

  const deleteAllSelectedMessages = () => {
    deleteMutation.mutate(
      {
        chatId,
        body: [...selectedMessages]
      },
      {
        onSuccess: () => {
          refetchMessages();
          setSelectedMessages([]);
        },
        onError: (err) => {
          toast.error(err.data?.title);
        }
      }
    );
  };

  const toggleMessage = (messageId) => {
    if (selectedMessages.includes(messageId))
      setSelectedMessages((prev) =>
        prev.filter((msgId) => msgId !== messageId)
      );
    else setSelectedMessages((prev) => [...prev, messageId]);
  };

  const disabled = useMemo(() => !text, [text]);

  useEffect(() => {
    if (selectedMessages.length === 0) return setMode(chatModes.CHAT);

    return setMode(chatModes.SELECT);
  }, [selectedMessages]);

  useEffect(() => {
    if (isChat || !data || !data.lists) return;

    const _files = [];

    data.lists
      ?.filter((message) => message.searchFiles?.length > 0)
      ?.forEach((message) =>
        message.searchFiles?.map((file) => _files.push(file))
      );

    setRelatedFiles((prev) => arrayUniqueByKey([...prev, ..._files]));
  }, [data]);

  const onTexting = (e) => {
    setText(e.target.value);
  };

  const onSend = useCallback(
    (e) => {
      e.preventDefault();
      setText("");

      if (textGenerator?.isStreaming) dispatch(stopStreaming({ chatId }));
      else startPrompting(text);
    },
    [textGenerator, text, chatId]
  );

  const handleCopySelectedMessages = async () => {
    if (!selectedMessages || selectedMessages.length === 0) return;

    let copyMarkdown = "";
    data?.lists?.forEach((message) => {
      if (selectedMessages.includes(message.id)) {
        copyMarkdown += `– ${
          message.role === "Assistant"
            ? "Datox Copilot"
            : "User: " + accounts?.[0]?.name
        }\nMessage: ${message.text}\n\n`;
      }
    });

    await navigator.clipboard.writeText(copyMarkdown);

    toast.success("Copied!");
  };

  const onFileUpload = (e) => {
    const _files = e.target.files;

    handleUpload(_files);
  };

  const onSelectQuestion = (question) => {
    startPrompting(question);
  };
};

export default useChatting;
