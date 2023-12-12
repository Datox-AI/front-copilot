import { NavLink } from "react-router-dom";
import styles from "../../style.module.scss";
import { Close } from "@mui/icons-material";
import classNames from "classnames";

const IntegrationTab = ({ icon, to, name, onClose, active, integrationId }) => {
  return (
    <button
      className={classNames(styles.integrationTab, { [styles.active]: active })}
    >
      <NavLink to={to}>
        {icon}
        {name}
      </NavLink>

      {name && active && <Close onClick={() => onClose(integrationId)} />}
    </button>
  );
};

export default IntegrationTab;
