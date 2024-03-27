import {
  Box,
  Button,
  TextField,
  TextareaAutosize,
  Typography
} from "@mui/material";
import { ReactComponent as FolderIcon } from "../../../assets/icons/folder.svg";
import { fileTypes } from "../../../consts/fileTypes";
import styles from "./style.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState } from "react";
import PreviewChat from "./PreviewChat";
import { useNavigate } from "react-router-dom";

export default function AssistantConfig() {
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [uploadFiles, setUploadFiles] = useState([]);

  const onUploadFiles = (e) => {
    const files = e.target.files;

    setUploadFiles((prev) => [...prev, ...files]);
  };

  const onRemove = (idx) => {
    setUploadFiles((prev) => prev.filter((_, index) => index !== idx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ChevronLeftRoundedIcon /> New GPT
        </button>

        <div className={styles.actions}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained">Create</Button>
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
                <CloudUploadOutlinedIcon />
                <input type="file" id="uploadAvatar" />
              </label>

              <Typography fontSize="20px" lineHeight="24px">
                New <br />
                Assistant
              </Typography>
            </Box>

            <button className={styles.default_btn}>Use GPT Icon</button>
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
            <TextareaAutosize minRows={4} />
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
                      onClick={() => onRemove(fIdx)}
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
                  style={{
                    display: "none"
                  }}
                />
              </label>

              <Button variant="contained">Save</Button>
            </Box>
          </Box>
        </div>

        <Box width="35%">
          <PreviewChat name={name} description={description} />
        </Box>
      </div>
    </div>
  );
}
