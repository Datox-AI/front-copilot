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

const PopoverMenu = ({ data = _data, mainIcon = <MoreHorizIcon /> }) => {
  return (
    <button className={classNames(styles.more)}>
      <Box display="flex" alignItems="center" gap="10px">
        {mainIcon}
      </Box>

      <div className={styles.command_context}>
        <ul className={styles.commands}>
          {data.map((item, i) => (
            <li className={styles.command} key={i} onClick={item.onClick}>
              <item.icon />
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
};

export default PopoverMenu;
