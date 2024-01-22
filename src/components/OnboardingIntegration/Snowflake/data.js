import IntegrationDetailsQuery from "./IntegrationDetailsQuery";
import OAuthSecurityQuery from "./OAuthSecurityQuery";
import OAuthUserCredentialsQuery from "./OAuthUserCredentialsQuery";
import SnowflakeAccountIdentifierQuery, {
  SnowflakeAccountIdentifierTip
} from "./SnowflakeAccountIdentifierQuery";
import UserRoleConfiguration from "./UserRoleConfiguration";

export const steps = [0, 1, 2, 3, 4];

export const _keywords = [
  {
    type: "key",
    label: "ALTER USER"
  },
  {
    type: "input",
    label: "USERNAME",
    value: "",
    isEdit: false
  },
  {
    type: "key",
    label: "SET"
  },
  {
    type: "default",
    label: "DEFAULT_ROLE=",
    br: false
  },
  {
    type: "input",
    label: "SYSADMIN",
    value: ""
  }
];

export const oauthKeywords = [
  {
    type: "key",
    label: "CREATE"
  },
  {
    type: "default",
    label: "OR REPLACE SECURITY DATOX_INTEGRATION",
    br: true
  },
  {
    type: "default",
    label: "TYPE = OAUTH",
    br: true
  },
  {
    type: "default",
    label: "ENABLED ="
  },
  {
    type: "default",
    label: "TRUE",
    color: "#4ADA95",
    br: true
  },
  {
    type: "default",
    label: "OAUTH_CLIENT = CUSTOM",
    br: true
  },
  {
    type: "default",
    label: "OAUTH_CLIENT_TYPE ="
  },
  {
    type: "default",
    label: "'CONFIDENTIAL'",
    br: true,
    color: "#FF3232"
  },
  {
    type: "default",
    label: "OAUTH_REDIRECT_URI  ="
  },
  {
    type: "default",
    label: "'https://copilot.datox.ai/callback/snowflake';",
    color: "#FF3232",
    br: true
  }
];

export const integrationKeywords = [
  {
    type: "key",
    label: "DESC"
  },
  {
    type: "default",
    label: "SECURITY DATOX_INTEGRATION;"
  }
];

export const credentialKeywords = [
  {
    type: "key",
    label: "SELECT"
  },
  {
    type: "default",
    label: "SYSTEM$SHOW_OAUTH_CLIENT_SECRETS ("
  },
  {
    type: "default",
    label: "'DATOX_INTEGRATION'",
    color: "#FF3232"
  },
  {
    type: "default",
    label: ");"
  }
];

export const _content = [
  {
    title: "User Role Configuration",
    description: `Copy and run the below query in your Snowflake account. Replace the values in the <br/>[brackets] with your username and desired role respectively before copying.<br/><span style="color: #FF3232;">Note: You can not choose ACCOUNTADMIN or ORGADMIN for security purposes. </span>`,
    keywords: [..._keywords],
    component: UserRoleConfiguration
  },
  {
    title: "Entering Snowflake Account Identifier",
    description: `You can navigate to the bottom left of your screen, clock on the drop-down, hover over to your account name and select the copy option`,
    component: SnowflakeAccountIdentifierQuery,
    extra: SnowflakeAccountIdentifierTip
  },
  {
    title: "Creating OAuth Security Integration",
    description: `In a new line in the same worksheet, please copy and run the below query.`,
    keywords: [...oauthKeywords],
    component: OAuthSecurityQuery
  },
  {
    title: "Retrieving Integration Details",
    description: `In the next line, run the below query to get the OUATH_TOKEN_ENDPOINT and paste in the below text box`,
    keywords: [...integrationKeywords],
    component: IntegrationDetailsQuery
  },
  {
    title: "Obtaining OAuth Client Secret and Client ID",
    description: `Acquire the OAUTH_CLIENT_SECRET and CLIENT_ID by executing`,
    keywords: [...credentialKeywords],
    component: OAuthUserCredentialsQuery
  }
];
