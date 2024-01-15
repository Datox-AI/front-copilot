import styles from "./style.module.scss";
import classNames from "classnames";

import { ReactComponent as ChevronDownI } from "../../../assets/icons/chevron-down.svg";
import { ReactComponent as CloseI } from "../../../assets/icons/close.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ColumnDetails = ({ children }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.togglerWrapper}>
        <span></span>
        <ChevronDownI
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            transform: !isOpen && `rotateZ(180deg)`
          }}
        />

        <button onClick={() => navigate("../../")}>
          Close <CloseI />
        </button>
      </div>
      <div className={classNames(styles.content, { [styles.isOpen]: isOpen })}>
        {children}
      </div>
    </div>
  );
};

export default ColumnDetails;
