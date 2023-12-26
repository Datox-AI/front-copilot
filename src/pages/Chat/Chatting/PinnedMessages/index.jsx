import styles from "./style.module.scss";
import { ReactComponent as PinIcon } from "../../../../assets/icons/pin.svg";
import { ReactComponent as VerticalDotsIcon } from "../../../../assets/icons/vertical_dots.svg";
import { ReactComponent as EyeIcon } from "../../../../assets/icons/eye.svg";
import { ReactComponent as UnpinIcon } from "../../../../assets/icons/unpin.svg";
import { useMemo, useState } from "react";
import { CircularProgress } from "@mui/material";

import UnfoldLessRoundedIcon from "@mui/icons-material/UnfoldLessRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import classNames from "classnames";
import PopoverMenu from "../../../../components/PopoverMenu";
import useMessagesAPI from "../../../../hooks/api/useMessagesAPI";
import toast from "react-hot-toast";

const PinnedMessages = ({ pinnedMessages, chatId, refetch }) => {
  const { pinMutation } = useMessagesAPI({});

  const [isCollapsed, setIsCollapsed] = useState(true);

  const commands = useMemo(() => {
    return [
      {
        title: isCollapsed ? "Expand" : "Collapse",
        icon: !isCollapsed ? UnfoldLessRoundedIcon : UnfoldMoreRoundedIcon,
        onClick: () => setIsCollapsed((prev) => !prev),
        iconProps: {
          size: 14,
          width: 14,
          fontSize: "14px"
        }
      },
      {
        title: "Go to message",
        icon: EyeIcon,
        onClick: () => {
          document
            .getElementById(
              "message-" + pinnedMessages?.[pinnedMessages.length - 1]?.id
            )
            ?.scrollIntoView({ block: "start" });
        }
      },
      {
        iconProps: {
          size: 16
        },
        title: "Unpin",
        icon: pinMutation.isLoading ? CircularProgress : UnpinIcon,
        onClick: () => {
          const lastPinnedMessage = pinnedMessages?.[pinnedMessages.length - 1];
          pinMutation.mutate(
            {
              id: lastPinnedMessage?.id,
              chatId,
              body: {
                pinned: !lastPinnedMessage?.pinned,
                id: lastPinnedMessage?.id
              }
            },
            {
              onSuccess: () => {
                refetch();
              },
              onError: (err) => {
                toast.error(err.data?.detail);
              }
            }
          );
        }
      }
    ];
  }, [pinnedMessages, pinMutation, chatId, isCollapsed]);

  return (
    <div
      className={classNames(styles.container, {
        [styles.open]: pinnedMessages.length > 0,
        [styles.isExpanded]: !isCollapsed
      })}
    >
      <ul>
        <li>
          <PinIcon />{" "}
          <span>{pinnedMessages?.[pinnedMessages.length - 1]?.text}</span>{" "}
          <PopoverMenu mainIcon={<VerticalDotsIcon />} data={commands} />
        </li>
      </ul>
    </div>
  );
};

export default PinnedMessages;
