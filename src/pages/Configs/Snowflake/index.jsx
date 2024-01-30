import ConfigWrapper from "../../../components/ConfigWrapper";
import styles from "../style.module.scss";
import ConfigCard from "../../../components/ConfigCard";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import useSnowflakeAPI from "../../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";
import OnboardingSnowflake from "../../../components/OnboardingIntegration/Snowflake";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  SNOWFLAKE_REDIRECT_URL,
  SNOWFLAKE_TEST_ACCOUNT_IDENTIFIER,
  SNOWFLAKE_TEST_CLIENT_ID,
  SNOWFLAKE_TEST_CLIENT_SECRET,
  SNOWFLAKE_TEST_TOKEN_ENDPOINT,
  SNOWFLAKE_TEST_WAREHOUSE
} from "../../../consts/snowflake";
import { useSelector } from "react-redux";

const SnowflakeConfig = () => {
  const navigate = useNavigate();
  const { initAuth, credentials } = useSnowflakeAPI({
    enableUserCredentials: true
  });

  const { skipOnboarding } = useSelector(
    (store) => store.integrations.snowflake
  );

  const onEdit = () => {
    navigate("/configs/snowflake/1");
  };

  const onSignIn = () => {
    initAuth.mutate(
      {
        account_identifier: credentials?.account_identifier,
        client_id: credentials?.client_id,
        client_secret: credentials?.client_secret,
        token_endpoint: credentials?.token_endpoint,
        redirect_uri: credentials?.redirect_uri,
        warehouse: credentials?.warehouse
      },
      {
        onSuccess: (res) => {
          window.location.replace(res.authorization_url);
        },
        onError: (err) => {
          toast.err(err.data.detail);
        }
      }
    );
  };

  if (!skipOnboarding) return <OnboardingSnowflake />;

  return (
    <div className={styles.container}>
      <ConfigWrapper>
        <Box display="flex" width="100%" flexDirection="column">
          <ConfigCard
            name={credentials?.account_identifier}
            description={credentials?.client_id}
            onEdit={onEdit}
            onSignIn={onSignIn}
          />
          {/* <Button
            className={styles.btn}
            onClick={() => navigate("/configs/snowflake/create")}
          >
            <AddRoundedIcon /> Add Account
          </Button> */}
        </Box>
      </ConfigWrapper>
    </div>
  );
};

export default SnowflakeConfig;
