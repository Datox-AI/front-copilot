import { useState } from "react";
import styles from "./style.module.scss";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import classNames from "classnames";

const ExpandMenu = ({ title = "Today", children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.expandContainer}>
      <button
        className={classNames(styles.toggleBtn, { [styles.isOpen]: isOpen })}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{title}</p>

        <ExpandMoreRoundedIcon
          style={{
            transform: !isOpen && "rotateZ(-90deg)"
          }}
        />
      </button>
      {isOpen && <div className={styles.toggleMenu}>{children}</div>}
    </div>
  );
};

export default ExpandMenu;
