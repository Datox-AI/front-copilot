import styles from "../../style.module.scss";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import classNames from "classnames";
import useChatsAPI from "../../../../../hooks/api/useChatsAPI";
import PopoverMenu from "../../../../../components/PopoverMenu";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as DotsIcon } from "../../../../../assets/icons/vertical-dots.svg";
import { ReactComponent as PencilIcon } from "../../../../../assets/icons/edit.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/icons/pin.svg";
import { ReactComponent as PinnedIcon } from "../../../../../assets/icons/unpin.svg";
import { ReactComponent as TrashIcon } from "../../../../../assets/icons/trash.svg";

const ChatItem = ({
  name,
  chatId = "2",
  active,
  maxWidth,
  isPinned,
  icon,
  refetchChatList,
  onDelete,
  isMinimized,
  isVerticalMoreIcon,
  link,
  isAudit,
  ...props
}) => {
  const navigate = useNavigate();

  const { updateChat } = useChatsAPI({});

  const [newName, setNewName] = useState(name);
  const [isRename, setIsRename] = useState(false);

  useEffect(() => {
    if (name === newName) return;
    setNewName(name);
  }, [name]);

  const onTogglePin = () => {
    updateChat.mutate(
      {
        id: chatId,
        body: {
          pinned: !isPinned,
          id: chatId,
          name
        }
      },
      {
        onSuccess: (res) => {
          refetchChatList();
        }
      }
    );
  };

  const onRename = () => {
    setIsRename(false);

    if (newName === name) return;

    updateChat.mutate(
      {
        id: chatId,
        body: {
          id: chatId,
          name: newName,
          pinned: isPinned
        }
      },
      {
        onSuccess: (res) => {
          refetchChatList();
        }
      }
    );
  };

  return (
    <>
      <button
        className={classNames(styles.chatItem, {
          [styles.maxWidth]: maxWidth,
          [styles.active]: active,
          [styles.isMinimized]: isMinimized
        })}
        type="button"
        {...props}
      >
        {isRename ? (
          <RenameChat
            newName={newName}
            setNewName={setNewName}
            onConfirm={onRename}
          />
        ) : (
          <>
            <div className={styles.meta} onClick={() => navigate(link)}>
              {isMinimized ? icon || <PinIcon /> : icon}
              {!isMinimized && (
                <>
                  {isPinned && <PinIcon />}
                  <p>{newName}</p>
                </>
              )}
            </div>
            {!isAudit && !isMinimized && (
              <>
                <PopoverMenu
                  position="bottom"
                  mainIcon={<DotsIcon />}
                  data={[
                    {
                      title: "Rename",
                      icon: PencilIcon,
                      onClick: () => setIsRename((prev) => !prev)
                    },
                    {
                      title: isPinned ? "Unpin" : "Pin",
                      icon: isPinned ? PinnedIcon : PinIcon,
                      onClick: onTogglePin
                    },
                    {
                      title: "Delete",
                      icon: TrashIcon,
                      onClick: () => onDelete(chatId)
                    }
                  ]}
                />
              </>
            )}
          </>
        )}
      </button>
    </>
  );
};

const RenameChat = ({ newName, setNewName, onConfirm }) => {
  return (
    <>
      <div className={styles.meta}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ background: "#fff", border: "none", outline: "none" }}
        />
      </div>
      <span>
        <CheckRoundedIcon onClick={onConfirm} />
      </span>
    </>
  );
};

export default ChatItem;
