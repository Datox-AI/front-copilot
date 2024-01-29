import styles from "../style.module.scss";

import { IntegrationForm } from "../../Chat/FileBar/NewChatPopup";
import { Box, Typography } from "@mui/material";
import { integrationIcons } from "../../../consts/integrations";
import { useLocation } from "react-router-dom";

const SnowflakeConfigAdd = () => {
  const location = useLocation();
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Box display="flex" width="100%">
          <Box display="flex" alignItems="center" gap="15px">
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
            <Typography fontSize="25px" fontWeight={600}>
              Snowflake
            </Typography>
          </Box>
        </Box>
        <IntegrationForm
          initAccountIdentifier={location.state?.accountIdentifier}
          initClientId={location.state?.clientId}
          initClientSecret={location.state?.clientSecret}
          initOauthTokenEndpoint={location.state?.accountIdentifier}
        />
      </div>
    </div>
  );
};

export default SnowflakeConfigAdd;
