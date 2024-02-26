import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import styles from "./style.module.scss";
import classNames from "classnames";

import { connectionStatuses } from "../../../../../consts/snowflake";
import { Tooltip } from "@mui/material";
import { ReactComponent as CheckedIcon } from "../../../../../assets/icons/checked.svg";
import { motion } from "framer-motion";

export default function ConnectionStatuses({ status }) {
  switch (status) {
    case connectionStatuses.NOT_CONNECTED:
      return (
        <Tooltip title="Not connected">
          <button className={classNames(styles.NOT_CONNECTED, styles.badge)}>
            <CloseRoundedIcon />
          </button>
        </Tooltip>
      );
    case connectionStatuses.CONNECTING:
      return (
        <Tooltip title="Connecting...">
          <button className={classNames(styles.CONNECTING, styles.badge)}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AutorenewRoundedIcon />
            </motion.span>
          </button>
        </Tooltip>
      );
    case connectionStatuses.CONNECTED:
      return (
        <Tooltip title="Connected">
          <button className={classNames(styles.CONNECTED, styles.badge)}>
            <CheckedIcon />
          </button>
        </Tooltip>
      );
    default:
      return <></>;
  }
}
