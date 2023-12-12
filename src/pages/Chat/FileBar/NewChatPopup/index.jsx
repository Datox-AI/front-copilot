import Popup from "../../../../components/Popup";
import styles from "../style.module.scss";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { Search } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { ReactComponent as SnowflakeIcon } from "../../../../assets/icons/snowflake.svg";
import { Box, Button, TextField, Typography } from "@mui/material";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.integrationFormContainer}>
      <div className={styles.form}>
        <label className={styles.field}>
          <span>Server</span>
          <TextField placeholder="designer.snowflakecomputing.com" />
        </label>
        <label className={styles.field}>
          <span>Warehouse</span>
          <TextField placeholder="Designer_figma_warehouse" />
        </label>
        <label className={styles.field}>
          <span>Username</span>
          <TextField placeholder="Write your username" />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <TextField placeholder="Write your password" type="password" />
        </label>

        <Box width="100%">
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            gap="10px"
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              width: "auto",
              cursor: "pointer"
            }}
          >
            Advanced options{" "}
            {isOpen ? (
              <KeyboardArrowDownRoundedIcon />
            ) : (
              <KeyboardArrowRightRoundedIcon />
            )}
          </Typography>
        </Box>

        {isOpen && (
          <>
            <label className={styles.field}>
              <span>Specify a text value to use as Role name (optional)</span>
              <TextField placeholder="Write your role name" />
            </label>

            <label className={styles.field}>
              <span>Command timeout seconds (optional)</span>
              <TextField placeholder="123" />
            </label>

            <label className={styles.field}>
              <span>Specify a text value to use as Role name (optional)</span>
              <TextField placeholder="Write your role name" />
            </label>

            <label className={styles.field}>
              <span>Command timeout seconds (optional)</span>
              <TextField placeholder="123" />
            </label>

            <label className={styles.field}>
              <span>Connection timeout in seconds (optional)</span>
              <TextField placeholder="123" />
            </label>

            <label className={styles.field}>
              <span>Include relationship columns (optional)</span>
              <TextField placeholder="123" />
            </label>

            <label className={styles.field}>
              <span>Database (optional)</span>
              <TextField placeholder="Demo_WH" />
            </label>

            <label
              className={styles.field}
              style={{
                width: "100%"
              }}
            >
              <span>SQL statement (optional, requires database)</span>
              <textarea rows={4} placeholder="123" />
            </label>
          </>
        )}
      </div>

      <div className={styles.footer}>
        <Button variant="contained">Save</Button>
        <Button variant="outlined">Cancel</Button>
      </div>
    </div>
  );
};

const NewChatPopup = ({ isOpen, toggle }) => {
  const [integration, setIntegration] = useState(null);

  const Render = !integration ? SelectIntegration : IntegrationForm;

  return (
    <Popup
      isOpen={isOpen}
      close={toggle}
      title={
        integration ? (
          <>
            <SnowflakeIcon />
            {integration.label}
          </>
        ) : (
          "Integration"
        )
      }
    >
      <Render selectIntegration={setIntegration} />
    </Popup>
  );
};

export default NewChatPopup;
