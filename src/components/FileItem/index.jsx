import { Box } from "@mui/material";
import styles from "./style.module.scss";
import { fileTypes } from "../../consts/fileTypes";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import useDownloadAssistanFile from "../../hooks/api/useDownloadAssistantFile";
import { downloadFile } from "../../pages/Integration/ColumnDetails/Store";

const FileItem = ({
  type = "word",
  name,
  url,
  hideArrow,
  blobId,
  assistantId
}) => {
  const { mutate } = useDownloadAssistanFile();

  const onClick = () => {
    mutate(
      {
        assistantId,
        data: {
          knowledge_blob_name: blobId
        }
      },
      {
        onSuccess: (res) => {
          downloadFile(blobId, res);
        }
      }
    );
  };

  if (!url)
    return (
      <p className={styles.fileItem} onClick={onClick}>
        <Box display="flex" alignItems="center" gap="8px" maxWidth="93%">
          <img src={fileTypes[type]} width={17} />
          <h4>{name}</h4>
        </Box>

        {!hideArrow && <ArrowForwardIosRoundedIcon />}
      </p>
    );

  return (
    <a className={styles.fileItem} target="_blank" href={url}>
      <Box display="flex" alignItems="center" gap="8px" maxWidth="93%">
        <img src={fileTypes[type]} width={17} />
        <h4>{name}</h4>
      </Box>

      {!hideArrow && <ArrowForwardIosRoundedIcon />}
    </a>
  );
};

export default FileItem;
