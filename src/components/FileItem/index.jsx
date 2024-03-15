import { Box } from "@mui/material";
import styles from "./style.module.scss";
import { fileTypes } from "../../consts/fileTypes";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const FileItem = ({ type = "word", name, url }) => {
  return (
    <a className={styles.fileItem} target="_blank" href={url}>
      <Box display="flex" alignItems="center" gap="8px" maxWidth="93%">
        <img src={fileTypes[type]} width={17} />
        <h4>{name}</h4>
      </Box>

      <ArrowForwardIosRoundedIcon />
    </a>
  );
};

export default FileItem;
