import { NavLink } from "react-router-dom";
import styles from "../../style.module.scss";
import { Close } from "@mui/icons-material";
import classNames from "classnames";
import { integrationIcons } from "../../../../../consts/integrations";

const IntegrationTab = ({
  to,
  name,
  onClose,
  active,
  integrationId,
  iconType
}) => {
  return (
    <button
      className={classNames(styles.integrationTab, { [styles.active]: active })}
    >
      <NavLink to={to}>
        {integrationIcons[iconType]}
        {name}
      </NavLink>

      {name && active && <Close onClick={() => onClose(integrationId)} />}
    </button>
  );
};

export default IntegrationTab;
