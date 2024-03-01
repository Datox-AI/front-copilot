import ConfigWrapper from "../../../components/ConfigWrapper";
import styles from "../style.module.scss";
import ConfigCard from "../../../components/ConfigCard";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import useSnowflakeAPI from "../../../hooks/api/useSnowflakeAPI";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trash.svg";
import { ReactComponent as WarningIcon } from "../../../assets/icons/warning.svg";
import { useRef, useState } from "react";
import { Close } from "@mui/icons-material";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { toggleSkipOnboarding } from "../../../redux/integrations/integrationsSlice";
import OnboardingSnowflake from "../../../components/OnboardingIntegration/Snowflake";

const SnowflakeConfig = () => {
  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDocumentation, setShowDocumentation] = useState(false);

  const { credentials, deleteAuth, refetchCredentials } = useSnowflakeAPI({
    enableUserCredentials: true
  });

  const { skipOnboarding } = useSelector(
    (store) => store.integrations.snowflake
  );

  const onEdit = () => {
    navigate("/configs/snowflake/1");
  };

  const onSignIn = () => {
    window.location.replace(credentials?.authorization_url);
  };

  useOutsideClick(
    ref,
    showDocumentation ? () => setShowDocumentation(false) : () => {}
  );

  if (!skipOnboarding) return <OnboardingSnowflake />;

  return (
    <div className={styles.container}>
      <ConfigWrapper>
        <Box display="flex" width="100%" flexDirection="column">
          {credentials && (
            <ConfigCard
              name={credentials?.account_identifier}
              description={credentials?.client_id}
              onEdit={onEdit}
              onSignIn={onSignIn}
            />
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {credentials && (
              <Button
                className={styles.btn}
                onClick={() => {
                  deleteAuth.mutate(null, {
                    onSuccess: () => {
                      refetchCredentials();
                      window.location.reload();
                    }
                  });
                }}
              >
                {deleteAuth.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <TrashIcon /> &nbsp; Delete Account
                  </>
                )}
              </Button>
            )}

            {!credentials && (
              <Box
                display="flex"
                alignItems="center"
                gap="10px"
                position="relative"
              >
                <Button
                  className={styles.btn}
                  onClick={() => navigate("/configs/snowflake/create")}
                >
                  <AddRoundedIcon /> Add Account
                </Button>
                <InfoRoundedIcon
                  style={{ cursor: "pointer", color: "red", marginTop: "5px" }}
                  onClick={() => setShowDocumentation((prev) => !prev)}
                />

                {showDocumentation && (
                  <div className={styles.content}>
                    <Close onClick={() => setShowDocumentation(false)} />
                    <div
                      style={{
                        paddingBottom: "16px",
                        borderBottom: "1px solid #E2E2E2"
                      }}
                    >
                      <h4>Welcome to Datox – Snowflake Integration</h4>
                      <p>
                        If you are coming here for the first time, please,
                        follow the documentation on configuring snowflake
                        integration
                      </p>
                    </div>

                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={() => dispatch(toggleSkipOnboarding())}
                      >
                        Let's proceed
                      </Button>
                    </Box>
                  </div>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </ConfigWrapper>
    </div>
  );
};

export default SnowflakeConfig;
