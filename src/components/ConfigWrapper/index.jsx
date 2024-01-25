import styles from "./style.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { Box } from "@mui/material";
import { integrationIcons } from "../../consts/integrations";
import { useNavigate } from "react-router-dom";

const ConfigWrapper = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <Box
              width={40}
              height={40}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius={20}
              bgcolor="#E1E1F3"
            >
              {integrationIcons.snowflake}
            </Box>

            <Box>
              <h2>Snowflake</h2>
              <p>datox.snowflakecomputing.com</p>
            </Box>
          </div>

          <CloseRoundedIcon
            onClick={() => navigate("/chat")}
            style={{
              cursor: "pointer",
              fontSize: 30
            }}
          />
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default ConfigWrapper;
