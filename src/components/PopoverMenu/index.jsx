import classNames from "classnames";
import styles from "./style.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { ReactComponent as ReplyIcon } from "../../assets/icons/reply.svg";
import { ReactComponent as PinIcon } from "../../assets/icons/pin.svg";

import { Box, Popover } from "@mui/material";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

const _data = [
  {
    icon: ReplyIcon,
    title: "Reply",
    onClick: () => {}
  },
  {
    icon: PinIcon,
    title: "Pin",
    onClick: () => {}
  }
];

const PopoverMenu = ({
  data = _data,
  mainIcon = <MoreHorizIcon />,
  position = "bottom" | "top",
  isClickable = true
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const ref = useRef();

  useOutsideClick(ref, () => setAnchorEl(null));

  return (
    <>
      <button
        className={classNames(styles.more)}
        onClick={handleClick}
        ref={ref}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          position="relative"
          zIndex={1}
          aria-describedby={id}
        >
          {mainIcon}
        </Box>
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={styles.popover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <div className={styles.command_context}>
          <ul
            className={styles.commands}
            style={{
              top: position === "bottom" ? "calc(100% + 10px)" : "auto",
              bottom: position === "top" ? "calc(100% + 10px)" : "auto",
              display: isClickable && "block"
            }}
          >
            {data.map((item, i) => (
              <li className={styles.command} key={i} onClick={item.onClick}>
                {item.icon && <item.icon {...item.iconProps} />}
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    </>
  );
};

export default PopoverMenu;
