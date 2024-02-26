export const SNOWFLAKE_REDIRECT_URL =
  process.env.REACT_APP_SNOWFLAKE_REDIRECT_URL;
export const SNOWFLAKE_TEST_CLIENT_ID =
  process.env.REACT_APP_SNOWFLAKE_TEST_CLIENT_ID;
export const SNOWFLAKE_TEST_CLIENT_SECRET =
  process.env.REACT_APP_SNOWFLAKE_TEST_CLIENT_SECRET;
export const SNOWFLAKE_TEST_TOKEN_ENDPOINT =
  process.env.REACT_APP_SNOWFLAKE_TEST_TOKEN_ENDPOINT;
export const SNOWFLAKE_TEST_ACCOUNT_IDENTIFIER =
  process.env.REACT_APP_SNOWFLAKE_TEST_ACCOUNT_IDENTIFIER;
export const SNOWFLAKE_TEST_WAREHOUSE =
  process.env.REACT_APP_SNOWFLAKE_TEST_WAREHOUSE;

export const connectionStatuses = {
  CONNECTED: "connected",
  CONNECTING: "connecting",
  NOT_CONNECTED: "not connected"
};

export const snowflakeMessageHandlers = {
  SUCCESSFULY_CONNECTED: "Engine is connected succesfully",
  NOT_CONNECTED: "Engine is not connected",
  STOPPED: "Agent is stopped",
  SNOWFLAKE_TOKEN_EXPIRED: "Snowflake token is expired",
  SNOWFLAKE_TOKEN_INVALID: "Snowflake token is invalid",
  AZURE_TOKEN_INVALID: "Azure token is invalid",
  AZURE_TOKEN_EXPIRED: "Azure token is expired"
};
