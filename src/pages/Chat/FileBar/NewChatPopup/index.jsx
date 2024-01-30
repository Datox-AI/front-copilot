import Popup from "../../../../components/Popup";
import styles from "../style.module.scss";
import useSnowflakeAPI from "../../../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleIntegrationConfig } from "../../../../redux/integrations/integrationsSlice";
import { integrationIcons } from "../../../../consts/integrations";
import { SNOWFLAKE_REDIRECT_URL } from "../../../../consts/snowflake";
import { useNavigate } from "react-router-dom";

export const IntegrationForm = ({
  initClientId,
  initWarehouse,
  initClientSecret,
  initAccountIdentifier,
  initOauthTokenEndpoint
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { initAuth } = useSnowflakeAPI();

  const [accountIdentifier, setAccountIdentifier] = useState(
    initAccountIdentifier
  );
  const [clientId, setClientId] = useState(initClientId);
  const [clientSecret, setClientSecret] = useState(initClientSecret);
  const [tokenEndpoint, setTokenEndpoint] = useState(initOauthTokenEndpoint);
  const [manualWarehouse, setManualWarehouse] = useState(initWarehouse);

  useEffect(() => {
    setClientId(initClientId);
  }, [initClientId]);

  useEffect(() => {
    setAccountIdentifier(initAccountIdentifier);
  }, [initAccountIdentifier]);

  useEffect(() => {
    setClientSecret(initClientSecret);
  }, [initClientSecret]);

  useEffect(() => {
    setTokenEndpoint(initOauthTokenEndpoint);
  }, [initOauthTokenEndpoint]);

  useEffect(() => {
    setManualWarehouse(initWarehouse);
  }, [initWarehouse]);

  const close = () => {
    dispatch(toggleIntegrationConfig(null));
    navigate("../");
  };

  const onAuth = () => {
    initAuth.mutate(
      {
        account_identifier: accountIdentifier,
        client_id: clientId,
        client_secret: clientSecret,
        token_endpoint: tokenEndpoint,
        redirect_uri: SNOWFLAKE_REDIRECT_URL,
        warehouse: manualWarehouse
      },
      {
        onSuccess: (res) => {
          close();
          window.location.replace(res.authorization_url);
        },
        onError: (err) => {
          console.log(err);

          toast.err(err.data.detail);
        }
      }
    );
  };

  return (
    <div className={styles.integrationFormContainer}>
      <div className={styles.form}>
        <label className={styles.field}>
          <span>Account Identifier</span>
          <TextField
            value={accountIdentifier}
            onChange={({ target: { value } }) => setAccountIdentifier(value)}
          />
        </label>

        <label className={styles.field}>
          <span>Client ID</span>
          <TextField
            value={clientId}
            onChange={({ target: { value } }) => setClientId(value)}
          />
        </label>

        <label className={styles.field}>
          <span>Client Secret</span>
          <TextField
            type="password"
            value={clientSecret}
            onChange={({ target: { value } }) => setClientSecret(value)}
          />
        </label>

        <label className={styles.field}>
          <span>Token Endpoint</span>
          <TextField
            value={tokenEndpoint}
            onChange={({ target: { value } }) => setTokenEndpoint(value)}
          />
        </label>

        <label className={styles.field}>
          <span>Warehouse</span>
          <TextField
            value={manualWarehouse}
            onChange={({ target: { value } }) => setManualWarehouse(value)}
          />
        </label>
      </div>

      <div className={styles.footer}>
        <Button
          variant="contained"
          disabled={initAuth.isLoading}
          onClick={onAuth}
        >
          Connect
        </Button>
        <Button variant="outlined" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const NewChatPopup = ({ isOpen, toggle, integration }) => {
  return (
    <Popup
      isOpen={isOpen}
      close={toggle}
      title={
        integration ? (
          <>
            {integrationIcons[integration.iconType]}
            {integration.name}
          </>
        ) : (
          "Integration"
        )
      }
    >
      <IntegrationForm />
    </Popup>
  );
};

export default NewChatPopup;
