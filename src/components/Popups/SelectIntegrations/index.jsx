import styles from "./style.module.scss";
import Popup from "../../Popup";

import { Search } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { _integrations } from "../../../consts/integrations";

export const SelectIntegrations = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

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
              <li
                key={integr.name}
                onClick={() => navigate(integr.configUrl || integr.to)}
              >
                {integr.name}
              </li>
            ))}
        </ul>
      </div>
    </Popup>
  );
};
