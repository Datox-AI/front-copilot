import styles from "../../style.module.scss";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import classNames from "classnames";
import useChatsAPI from "../../../../../hooks/api/useChatsAPI";

import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { CircularProgress, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as PinIcon } from "../../../../../assets/icons/pin.svg";
import useOutsideClick from "../../../../../hooks/useOutsideClick";

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025"
};

const PopupBody = styled("div")(
  ({ theme }) => `
  width: 150px;
  // padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  box-shadow: ${
    theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 7px 15px 0px rgba(0, 0, 0, 0.10), 0px 27px 27px 0px rgba(0, 0, 0, 0.09), 0px 62px 37px 0px rgba(0, 0, 0, 0.05), 0px 110px 44px 0px rgba(0, 0, 0, 0.01), 0px 171px 48px 0px rgba(0, 0, 0, 0.00);

  ul {
    width: 100%;
    list-style: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;

    li{
      width: 100%;

      button{
        width: 150px;
        padding: 11px 15px;
        text-align: left;
        border-bottom: 1px solid #F6F5F8;
        background:  #FFF;
        color: #616161;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;

        svg{
          font-size: 18px;
        }
      }
    }
  }
`
);

const ChatItem = ({
  name,
  chatId = "2",
  active,
  maxWidth,
  isPinned,
  refetchChatList,
  onDelete,
  isVerticalMoreIcon,
  isAudit,
  ...props
}) => {
  const tooltipRef = useRef();
  const navigate = useNavigate();

  const { updateChat } = useChatsAPI({});

  const [anchor, setAnchor] = useState(null);
  const [newName, setNewName] = useState(name);
  const [isRename, setIsRename] = useState(false);

  useOutsideClick(tooltipRef, () => setAnchor(null));

  useEffect(() => {
    if (name === newName) return;
    setNewName(name);
  }, [name]);

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);

  const id = open ? "simple-popup-" + name : undefined;

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
    setAnchor(null);
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
          [styles.active]: active
        })}
        aria-describedby={id}
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
            <div className={styles.meta}>
              {isPinned && <PinIcon />}
              <p onClick={() => navigate(chatId)}>{newName}</p>
            </div>
            {!isAudit && (
              <span onClick={handleClick} ref={tooltipRef}>
                {updateChat.isLoading ? (
                  <CircularProgress size={10} />
                ) : (
                  <MoreHorizRoundedIcon
                    style={{
                      transform: isVerticalMoreIcon && "rotateZ(90deg)"
                    }}
                  />
                )}

                <BasePopup
                  id={id}
                  open={open}
                  anchor={anchor}
                  style={{
                    zIndex: 4
                  }}
                >
                  <PopupBody>
                    <ul>
                      <li>
                        <button
                          onClick={() => {
                            setAnchor(null);
                            setIsRename((prev) => !prev);
                          }}
                        >
                          <EditOutlinedIcon />
                          Rename
                        </button>
                      </li>
                      <li>
                        <button onClick={onTogglePin}>
                          {isPinned ? (
                            <>
                              <PushPinRoundedIcon /> Unpin
                            </>
                          ) : (
                            <>
                              <PushPinOutlinedIcon /> Pin
                            </>
                          )}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            onDelete(chatId);
                            setAnchor(null);
                          }}
                        >
                          <DeleteOutlineOutlinedIcon /> Delete
                        </button>
                      </li>
                    </ul>
                  </PopupBody>
                </BasePopup>
              </span>
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
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <span>
        <CheckRoundedIcon onClick={onConfirm} />
      </span>
    </>
  );
};

export default ChatItem;
