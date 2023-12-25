import styles from "./style.module.scss";
import classNames from "classnames";
import CopyAllIcon from "@mui/icons-material/CopyAll";

import { useHotkeys } from "react-hotkeys-hook";
import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as TickIcon } from "../../../../assets/icons/tick.svg";
const SelectedMessages = ({
  selectedMessages,
  onCancel,
  onDelete,
  onCopy,
  isLoading
}) => {
  useHotkeys("esc", () => onCancel(), []);
  useHotkeys("mod+c", () => onCopy(), []);
  useHotkeys("mod+d", () => onDelete(), [onDelete]);

  return (
    <div
      className={classNames(styles.selectedMessages, {
        [styles.open]: selectedMessages.length > 0
      })}
    >
      <Typography
        fontSize="14px"
        color="#616161"
        display="flex"
        alignItems="center"
        gap="8px"
      >
        <TickIcon /> Selected messages: {selectedMessages.length}
      </Typography>

      <Box display="flex" alignItems="center" gap="10px">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button variant="contained" onClick={onCopy}>
          <CopyAllIcon fontSize="24px" style={{ marginRight: 2 }} /> Copy
        </Button>
      </Box>
    </div>
  );
};

export default SelectedMessages;
