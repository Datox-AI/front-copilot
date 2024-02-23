import styles from "../style.module.scss";

import { IntegrationForm } from "../../Chat/FileBar/NewChatPopup";
import { Box, Typography } from "@mui/material";
import { integrationIcons } from "../../../consts/integrations";
import { useLocation, useParams } from "react-router-dom";
import useSnowflakeAPI from "../../../hooks/api/useSnowflakeAPI";

const SnowflakeConfigAdd = () => {
  const location = useLocation();
  const { id } = useParams();
  const { credentials, roles } = useSnowflakeAPI({
    enableUserCredentials: !!id,
    enableRoles: true
  });

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
          isCreate={id === "create"}
          initWarehouse={credentials?.warehouse}
          initClientId={location.state?.clientId || credentials?.client_id}
          initAccountIdentifier={
            location.state?.accountIdentifier || credentials?.account_identifier
          }
          initClientSecret={
            location.state?.clientSecret || credentials?.client_secret
          }
          initOauthTokenEndpoint={
            location.state?.oauthTokenEndpoint || credentials?.token_endpoint
          }
          roles={roles}
        />
      </div>
    </div>
  );
};

export default SnowflakeConfigAdd;
