import styles from "../../style.module.scss";
import classNames from "classnames";

import { NavLink, useLocation } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { integrationIcons } from "../../../../../consts/integrations";

const IntegrationTab = ({
  to,
  name,
  onClose,
  active,
  integrationId,
  iconType
}) => {
  const { pathname } = useLocation();

  return (
    <button
      className={classNames(styles.integrationTab, { [styles.active]: active })}
    >
      {pathname.includes(`/integration/${integrationId}`) ? (
        <a>
          {integrationIcons[iconType]}
          {name}
        </a>
      ) : (
        <NavLink to={`/integration/${integrationId}`}>
          {integrationIcons[iconType]}
          {name}
        </NavLink>
      )}

      {name && active && <Close onClick={() => onClose(integrationId)} />}
    </button>
  );
};

export default IntegrationTab;
