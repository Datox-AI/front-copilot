import ConfigWrapper from "../../../components/ConfigWrapper";
import styles from "../style.module.scss";
import ConfigCard from "../../../components/ConfigCard";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import useSnowflakeAPI from "../../../hooks/api/useSnowflakeAPI";

import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DeleteOutlineRounded } from "@mui/icons-material";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trash.svg";

const SnowflakeConfig = () => {
  const navigate = useNavigate();
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

  // if (!skipOnboarding) return <OnboardingSnowflake />;

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
              <Button
                className={styles.btn}
                onClick={() => navigate("/configs/snowflake/create")}
              >
                <AddRoundedIcon /> Add Account
              </Button>
            )}
          </Box>
        </Box>
      </ConfigWrapper>
    </div>
  );
};

export default SnowflakeConfig;
