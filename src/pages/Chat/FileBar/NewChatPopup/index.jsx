import Popup from "../../../../components/Popup";
import styles from "../style.module.scss";
import useSnowflakeAPI from "../../../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";

import { Search } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleIntegrationConfig } from "../../../../redux/integrations/integrationsSlice";
import { integrationIcons } from "../../../../consts/integrations";

const _integrations = [
  {
    name: "amazon",
    label: "Amazon Redshift"
  },
  {
    name: "server",
    label: "Server"
  },
  {
    name: "snowflake",
    label: "Snowflake"
  },
  {
    name: "microsoft",
    label: "Microsoft SQL"
  },
  {
    name: "bloomberg",
    label: "Bloomberg"
  },
  {
    name: "gdrive",
    label: "Google Drive"
  },
  {
    name: "dropbox",
    label: "Dropbox"
  }
];

const SelectIntegration = ({ selectIntegration }) => {
  const [value, setValue] = useState("");

  const mutatedIntegrations = useMemo(
    () =>
      !value
        ? _integrations
        : _integrations.filter((integr) =>
            integr.label.toLowerCase().includes(value.toLowerCase())
          ),
    [value]
  );

  return (
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
        {mutatedIntegrations.map((integr) => (
          <li key={integr.name} onClick={() => selectIntegration(integr)}>
            {integr.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const IntegrationForm = ({}) => {
  const dispatch = useDispatch();
  const { initAuth } = useSnowflakeAPI();

  const [accountIdentifier, setAccountIdentifier] = useState("kiprdnq-kl02065");
  const [clientId, setClientId] = useState("Ig0pIBW/qO7KzLflWUwlg6MaCdI=");
  const [clientSecret, setClientSecret] = useState(
    "Bn7AnJ6L1EcnVyWZlvDfmM8a9xOMeO5rwHw3Xu77A+s="
  );
  const [tokenEndpoint, setTokenEndpoint] = useState(
    "https://hc47250.uae-north.azure.snowflakecomputing.com/oauth/token-request"
  );

  const close = () => dispatch(toggleIntegrationConfig(null));

  const onAuth = () => {
    initAuth.mutate(
      {
        account_identifier: accountIdentifier,
        client_id: clientId,
        client_secret: clientSecret,
        token_endpoint: tokenEndpoint,
        redirect_uri: "https://copilot.datox.ai/callback/snowflake"
      },
      {
        onSuccess: (res) => {
          close();
          window.location.replace(res.authorization_url);
        },
        onError: (err) => {
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
