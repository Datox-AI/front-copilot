import styles from "./style.module.scss";

import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as TickIcon } from "../../../../assets/icons/tick.svg";
import classNames from "classnames";

const SelectedMessages = ({
  selectedMessages,
  onCancel,
  onDelete,
  isLoading
}) => {
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
      </Box>
    </div>
  );
};

export default SelectedMessages;
