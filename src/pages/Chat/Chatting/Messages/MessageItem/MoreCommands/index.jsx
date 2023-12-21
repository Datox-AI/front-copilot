import classNames from "classnames";
import styles from "../style.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useMessagesAPI from "../../../../../../hooks/api/useMessagesAPI";
import toast from "react-hot-toast";

import { ReactComponent as ReplyIcon } from "../../../../../../assets/icons/reply.svg";
import { ReactComponent as PinIcon } from "../../../../../../assets/icons/pin.svg";
import { ReactComponent as PinnedIcon } from "../../../../../../assets/icons/pinned.svg";
import { ReactComponent as CopyIcon } from "../../../../../../assets/icons/copy_message.svg";
import { ReactComponent as TickIcon } from "../../../../../../assets/icons/tick.svg";
import { ReactComponent as TrashIcon } from "../../../../../../assets/icons/trash.svg";
import { Box, CircularProgress } from "@mui/material";

const MoreCommands = ({ refetch, messageId, message, chatId, isPinned }) => {
  const { pinMutation } = useMessagesAPI({});

  const handleTogglePin = () => {
    pinMutation.mutate(
      {
        id: messageId,
        chatId,
        body: {
          id: messageId,
          pinned: !isPinned
        }
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (err) => {
          toast.error(err?.data?.message);
        }
      }
    );
  };

  return (
    <button className={classNames(styles.more)}>
      <Box display="flex" alignItems="center" gap="10px">
        {isPinned && <PinnedIcon className={styles.pin_icon} />}
        <MoreHorizIcon className={styles.more_icon} />
      </Box>

      <div className={styles.command_context}>
        <ul className={styles.commands}>
          <li className={styles.command}>
            <ReplyIcon />
            Reply
          </li>
          <li className={styles.command} onClick={handleTogglePin}>
            {pinMutation.isLoading ? (
              <CircularProgress size={14} />
            ) : isPinned ? (
              <PinnedIcon />
            ) : (
              <PinIcon />
            )}
            {isPinned ? "Unpin" : "Pin"}
          </li>
          <li className={styles.command}>
            <CopyIcon />
            Copy
          </li>
          <li className={styles.command}>
            <TickIcon />
            Select
          </li>
          <li className={styles.command}>
            <TrashIcon />
            Delete
          </li>
        </ul>
      </div>
    </button>
  );
};

export default MoreCommands;
