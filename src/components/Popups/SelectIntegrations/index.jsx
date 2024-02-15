import styles from "./style.module.scss";
import Popup from "../../Popup";

import { Search } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { _integrations } from "../../../consts/integrations";

export const SelectIntegrations = ({
  isOpen,
  toggle,
  snowflakeCredentials
}) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const onClick = (integration) => {
    if (integration.id === 2) {
      if (snowflakeCredentials) navigate(`/integration/${integration.id}`);
      else navigate(integration.configUrl || integration.to);
    } else {
      navigate(integration.to);
    }
  };

  return (
    <Popup isOpen={isOpen} close={toggle} title="Integrations">
      <div className={styles.selectIntegrationPopup}>
        <label htmlFor="search-integrations">
          <Search />
          <input
            placeholder="Search"
            id="search-integrations"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>

        <ul>
          {_integrations
            .filter(
              (integ) =>
                !!integ.name &&
                integ.name.toLowerCase().includes(value.toLowerCase())
            )
            .map((integr) => (
              <li key={integr.name} onClick={() => onClick(integr)}>
                {integr.name}
              </li>
            ))}
        </ul>
      </div>
    </Popup>
  );
};
