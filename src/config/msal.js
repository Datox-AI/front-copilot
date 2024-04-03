export const tenantId = "common";
export const redirectUri = process.env.REACT_APP_MSAL_REDIRECT_URI;
export const clientId = process.env.REACT_APP_MSAL_CLIENT_ID;
export const authority = `https://login.microsoftonline.com/${tenantId}`;

// Uncomment localhost when development, and comment for deployment
export const msalConfig = {
  auth: {
    clientId,
    authority,
    redirectUri
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  // scopes: ["api://aeec21ea-2bcc-43b1-afb0-4aaad8f8de26/api.access"]
  scopes: ["api://bfa83ea3-f6bf-4f47-824a-1522a51276ca/user_impersonation"]
};
