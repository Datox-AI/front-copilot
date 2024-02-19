import classNames from "classnames";
import styles from "./style.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { ReactComponent as ReplyIcon } from "../../assets/icons/reply.svg";
import { ReactComponent as PinIcon } from "../../assets/icons/pin.svg";

import { Box } from "@mui/material";
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
  const ref = useRef();

  const [open, setOpen] = useState(false);

  const onClick = () => {
    if (!isClickable) return;
    setOpen((prev) => !prev);
  };

  useOutsideClick(ref, () => setOpen(false));

  return (
    <button className={classNames(styles.more)} onClick={onClick} ref={ref}>
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        position="relative"
        zIndex={1}
      >
        {mainIcon}
      </Box>

      {isClickable && open && (
        <div className={styles.command_context}>
          <ul
            className={styles.commands}
            style={{
              top: position === "bottom" ? "calc(100% + 40px)" : "auto",
              bottom: position === "top" ? "calc(100% + 40px)" : "auto",
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
      )}
    </button>
  );
};

export default PopoverMenu;
