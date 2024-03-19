import toast from "react-hot-toast";
import useFileUpload from "./useFileUpload";

import { useCallback, useEffect, useMemo, useState } from "react";
import { arrayUniqueByKey } from "../utils";
import { useDispatch } from "react-redux";
import { chatModes } from "./useMessages";
import { useMsal } from "@azure/msal-react";
import { stopStreaming } from "../redux/chat/chatSlice";

const useChatting = ({
  data,
  isChat,
  chatId,
  isLoading,
  uploadFiles,
  textGenerator,
  deleteMutation,
  startPrompting,
  setUploadFiles,
  setRelatedFiles,
  refetchMessages,
  isSnowflakeChat,
  isAgentConnected,
  handleWsStopStreaming
}) => {
  const dispatch = useDispatch();

  const { accounts } = useMsal();
  const { handleUpload } = useFileUpload({ chatId });

  const [text, setText] = useState("");
  const [mode, setMode] = useState(chatModes);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isHighlightedMessage, setIsHiglightedMessage] = useState(null);

  const onHighlightMessage = (msg) => setIsHiglightedMessage(msg);

  useEffect(() => {
    if (!isHighlightedMessage) return;

    const interval = setInterval(() => setIsHiglightedMessage(null), 2000);

    return () => {
      clearInterval(interval);
    };
  }, [isHighlightedMessage]);

  const pinnedMessages = useMemo(() => {
    if (!data) return [];

    return data.filter((message) => message.pinned);
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

  const disabled = useMemo(() => {
    if (isSnowflakeChat) return !isAgentConnected || !text;

    return !text;
  }, [text, isAgentConnected, isSnowflakeChat]);

  useEffect(() => {
    if (selectedMessages.length === 0) return setMode(chatModes.CHAT);

    return setMode(chatModes.SELECT);
  }, [selectedMessages]);

  useEffect(() => {
    if (isChat || !data || !data) return;

    const _files = [];

    data
      ?.filter((message) => message.searched_files?.length > 0)
      ?.forEach((message) =>
        message.searched_files?.map((file) => _files.push(file))
      );

    setRelatedFiles((prev) => arrayUniqueByKey([...prev, ..._files], "id"));
  }, [data]);

  useEffect(() => {
    setText("");
  }, [chatId]);

  const onTexting = (e) => {
    setText(e.target.value);
  };

  const onSend = useCallback(
    (e) => {
      e?.preventDefault();

      const _text = text.trim();

      if (!_text && !textGenerator?.isStreaming) return;

      setText("");

      if (textGenerator?.isStreaming) {
        if (isSnowflakeChat) handleWsStopStreaming();
        else dispatch(stopStreaming({ chatId }));
      } else startPrompting(text, uploadFiles);
    },
    [textGenerator, text, chatId, uploadFiles]
  );

  const handleCopySelectedMessages = async () => {
    if (!selectedMessages || selectedMessages.length === 0) return;

    let copyMarkdown = "";
    data?.forEach((message) => {
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
    setUploadFiles((prev) => [...prev, ..._files]);
    // handleUpload(_files);
  };

  const onSelectQuestion = (question) => {
    startPrompting(question);
  };

  return {
    data,
    mode,
    text,
    disabled,
    isLoading,
    deleteMutation,
    pinnedMessages,
    selectedMessages,
    isHighlightedMessage,
    onSend,
    onTexting,
    onFileUpload,
    toggleMessage,
    refetchMessages,
    onSelectQuestion,
    onHighlightMessage,
    clearAllSelectedMessages,
    deleteAllSelectedMessages,
    handleCopySelectedMessages
  };
};

export default useChatting;
