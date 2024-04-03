import {
  Box,
  Button,
  CircularProgress,
  TextField,
  TextareaAutosize,
  Typography
} from "@mui/material";
import { ReactComponent as FolderIcon } from "../../../assets/icons/folder.svg";
import geminiIcon from "../../../assets/icons/gemini.png";
import { fileTypes } from "../../../consts/fileTypes";
import styles from "./style.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useEffect, useState } from "react";
import PreviewChat from "./PreviewChat";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useCreateAssistantAPI from "../../../hooks/api/useCreateAssistantAPI";
import toast from "react-hot-toast";
import useGetAssistantAPI from "../../../hooks/api/useGetAssistantAPI";
import useUpdateAssistantFileAPI from "../../../hooks/api/useUpdateAssistantFilesAPI";
import useUpdateAssistantAPI from "../../../hooks/api/useUpdateAssistantAPI";
import { getImageUrl } from "../../../utils";
import classNames from "classnames";
import useGetAssistantChatMessagesAPI from "../../../hooks/api/useGetAssistantChatMessagesAPI";

async function getImageFileFromUrl(url) {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: "image/png"
  };
  return new File([data], "gemini.png", metadata);
}

export default function AssistantConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const createAssistant = useCreateAssistantAPI();
  const updateAssistantFiles = useUpdateAssistantFileAPI({ assistantId: id });
  const updateAssistant = useUpdateAssistantAPI({ assistantId: id });

  const {
    data: chat,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useGetAssistantChatMessagesAPI({
    assistantId: id,
    chatId: searchParams.get("chatId")
  });

  const isCreate = id === "create";

  const { data, refetch } = useGetAssistantAPI({
    assistantId: !isCreate && id,
    queryParams: {
      enabed: !isCreate
    }
  });

  const [name, setName] = useState();
  const [icon, setIcon] = useState();
  const [description, setDescription] = useState();
  const [instructions, setInstructions] = useState();
  const [uploadFiles, setUploadFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isUseGPTIcon, setIsUseGPTIcon] = useState(false);

  const isSaving =
    createAssistant.isLoading ||
    updateAssistantFiles.isLoading ||
    updateAssistant.isLoading;

  useEffect(() => {
    if (!data) return;

    setName(data.name);
    setIcon(data.icon_file_path);
    setDescription(data.description);
    setInstructions(data.instructions);
    setUploadFiles(data.knowledge_files);
  }, [data]);

  const onUploadFiles = (e) => {
    const files = e.target.files;

    setUploadFiles((prev) => [...prev, ...files]);
  };

  const onRemove = (idx, id) => {
    if (id) {
      setDeletedFiles((prev) => [...prev, id]);
    }

    setUploadFiles((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleSave = () => {
    if (isCreate) return onCreate();

    onEdit();
  };

  const onEdit = async () => {
    const fileFormData = new FormData();
    const formData = new FormData();
    const newFiles = [...uploadFiles].filter((file) => !file.id);

    const file = await getImageFileFromUrl(geminiIcon);

    if (typeof icon !== "string" && (isUseGPTIcon || icon)) {
      if (isUseGPTIcon) formData.append("icon_file", file);
      else formData.append("icon_file", icon);
    }

    formData.append("assistant_name", name);
    formData.append("assistant_description", description);
    formData.append("assistant_instruction", instructions);

    deletedFiles.forEach((fileId) =>
      fileFormData.append("files_to_delete", fileId)
    );

    newFiles.forEach((file) => fileFormData.append("new_files", file));

    updateAssistant.mutate(formData, {
      onSuccess: () => {
        refetch();
        // toast.success("Assistant updated successfuly!");
      },
      onError: () => {
        toast.error("Error on updating an assistant");
      }
    });

    if (newFiles.length > 0 || deletedFiles.length > 0)
      updateAssistantFiles.mutate(fileFormData, {
        onError: () => {
          toast.error("Error on updating assistant files");
        }
      });
  };

  const onCreate = async () => {
    const formData = new FormData();
    if (uploadFiles.length === 0) return toast.error("Upload knowledge files");

    const file = await getImageFileFromUrl(geminiIcon);

    if (isUseGPTIcon || icon) {
      if (isUseGPTIcon) formData.append("icon_file", file);
      else formData.append("icon_file", icon);
    }

    formData.append("assistant_name", name);
    formData.append("assistant_description", description);
    formData.append("assistant_instruction", instructions);

    uploadFiles.forEach((file) => formData.append("knowledge_files", file));

    createAssistant.mutate(formData, {
      onSuccess: (res) => {
        navigate(`/assistant/config/${res.assistant_id}`);
        toast.success("New Assistant created successfuly!");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Error on creating a new assistant");
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/")}>
          <ChevronLeftRoundedIcon /> Back
        </button>

        <div className={styles.actions}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <CircularProgress size={20} />
            ) : !!data ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.form}>
          <Box
            width="100%"
            display="flex"
            gap="8px"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #E2E2E2"
            paddingBottom="16px"
          >
            <Box display="flex" gap="20px" alignItems="center">
              <label htmlFor="uploadAvatar" className={styles.label}>
                {!isUseGPTIcon && icon ? (
                  <img
                    src={typeof icon === "string" ? icon : getImageUrl(icon)}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  !isUseGPTIcon && <CloudUploadOutlinedIcon />
                )}

                {isUseGPTIcon && (
                  <img src={geminiIcon} width="100%" height="100%" />
                )}

                <input
                  type="file"
                  id="uploadAvatar"
                  accept="image/png"
                  onChange={(e) => setIcon(e.target.files[0])}
                />
              </label>

              <Typography fontSize="20px" lineHeight="24px">
                {name || (
                  <>
                    New <br />
                    Assistant
                  </>
                )}
              </Typography>
            </Box>

            <button
              onClick={() => setIsUseGPTIcon((prev) => !prev)}
              className={classNames(styles.default_btn, {
                [styles.active]: isUseGPTIcon
              })}
            >
              Use GPT Icon
            </button>
          </Box>

          <Box width="100%" display="flex" flexDirection="column" gap="8px">
            <span>Name your Assistant</span>
            <TextField
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          <Box width="100%" display="flex" flexDirection="column" gap="8px">
            <span>Description</span>
            <TextField
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box width="100%" display="flex" flexDirection="column" gap="8px">
            <span>Instructions</span>
            <TextareaAutosize
              minRows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Box>

          <Box width="100%" display="flex" flexDirection="column" gap="8px">
            <Box display="flex" gap="16px" alignItems="center">
              <div className={styles.icon}>
                <FolderIcon />
              </div>

              <Typography fontSize="16px" fontWeight={600}>
                Knowledge
              </Typography>
            </Box>

            <Typography fontSize="14px" fontWeight={400} color="#949494">
              If you upload files under Knowledge, conversations with your GPT
              may include file contents. Files can be downloaded when Code
              Interpreter is enabled.
            </Typography>

            {uploadFiles.length > 0 && (
              <Box className={styles.filesBox}>
                {uploadFiles.map((file, fIdx) => (
                  <div className={styles.file} key={fIdx}>
                    <img src={fileTypes[file.type]} height="13px" />
                    <p>{file.name}</p>
                    <span
                      className={styles.close}
                      onClick={() => onRemove(fIdx, file.id)}
                    >
                      <CloseRoundedIcon />
                    </span>
                  </div>
                ))}
              </Box>
            )}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <label htmlFor="uploadFiles">
                <span className={styles.uploadBtn}>Upload Files</span>

                <input
                  type="file"
                  id="uploadFiles"
                  onChange={onUploadFiles}
                  multiple
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{
                    display: "none"
                  }}
                />
              </label>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <CircularProgress size={20} /> : "Save"}
              </Button>
            </Box>
          </Box>
        </div>

        <Box width="35%" position="sticky" top={0}>
          <PreviewChat
            name={name}
            assistant={data}
            setChatId={(val) =>
              setSearchParams((prev) => ({ ...prev, chatId: val }))
            }
            gptIcon={data?.icon_file_path}
            chatId={searchParams.get("chatId")}
            description={description}
            assistantId={id}
            messages={chat?.messages}
            isLoading={isLoadingMessages}
            refetch={refetchMessages}
          />
        </Box>
      </div>
    </div>
  );
}
