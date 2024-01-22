import classNames from "classnames";
import styles from "./style.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { ReactComponent as ReplyIcon } from "../../assets/icons/reply.svg";
import { ReactComponent as PinIcon } from "../../assets/icons/pin.svg";

import { Box } from "@mui/material";

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
  position = "bottom" | "top"
}) => {
  return (
    <button className={classNames(styles.more)}>
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        position="relative"
        zIndex={1}
      >
        {mainIcon}
      </Box>

      <div className={styles.command_context}>
        <ul
          className={styles.commands}
          style={{
            top: position === "bottom" ? "calc(100% + 40px)" : "auto",
            bottom: position === "top" ? "calc(100% + 40px)" : "auto"
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
    </button>
  );
};

export default PopoverMenu;
