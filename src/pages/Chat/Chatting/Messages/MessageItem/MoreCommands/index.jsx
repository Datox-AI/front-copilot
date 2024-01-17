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
import { copyNavigator } from "../../../../../../utils";
import { useCallback, useEffect, useRef, useState } from "react";

const MoreCommands = ({
  refetch,
  messageId,
  message,
  chatId,
  isPinned,
  isSelected,
  toggleMessage,
  onReply
}) => {
  const ref = useRef();

  const [leftPosition, setLeftPosition] = useState("0");
  const [bottomPosition, setBottomPosition] = useState("-152px");

  const { pinMutation, deleteMutation } = useMessagesAPI({});

  const replaceMoreMenu = useCallback(() => {
    var distanceToRight =
      window.innerWidth - ref.current?.getBoundingClientRect().right;
    var distanceToBottom =
      window.innerHeight - ref.current?.getBoundingClientRect().bottom;

    if (distanceToBottom < 200) setBottomPosition(0);
    else setBottomPosition("-152px");

    if (distanceToRight < 200) setLeftPosition("-140px");
    else setLeftPosition("0");
  }, [
    ref.current?.getBoundingClientRect().right,
    ref.current?.getBoundingClientRect().bottom,
    window.innerHeight,
    window.innerWidth
  ]);

  useEffect(() => {
    document
      .getElementById("messages-list")
      .addEventListener("scroll", () => replaceMoreMenu());

    replaceMoreMenu();
  }, [ref.current]);

  const handleDeleteMessage = () => {
    if (deleteMutation.isLoading) return;

    deleteMutation.mutate(
      { chatId: chatId, body: [messageId] },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (err) => {
          toast.error(err.data.detail);
        }
      }
    );
  };

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
          toast.error(err.data?.title);
        }
      }
    );
  };

  return (
    <button className={classNames(styles.more)} ref={ref}>
      <Box display="flex" alignItems="center" gap="10px">
        {isPinned && <PinnedIcon className={styles.pin_icon} />}
        <MoreHorizIcon className={styles.more_icon} />
      </Box>

      <div className={styles.command_context}>
        <ul
          className={styles.commands}
          style={{
            top: "auto",
            left: leftPosition,
            bottom: bottomPosition,
            width: 160
          }}
        >
          <li className={styles.command} onClick={onReply}>
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
          <li className={styles.command} onClick={() => copyNavigator(message)}>
            <CopyIcon />
            Copy
          </li>
          <li className={styles.command} onClick={toggleMessage}>
            <TickIcon />
            {isSelected ? "Unselect" : "Select"}
          </li>
          <li className={styles.command} onClick={handleDeleteMessage}>
            {deleteMutation.isLoading ? (
              <>
                <CircularProgress size={14} />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon />
                Delete
              </>
            )}
          </li>
        </ul>
      </div>
    </button>
  );
};

export default MoreCommands;
