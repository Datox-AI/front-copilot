export const tenantId = "common";
// export const redirectUri = "http://localhost:3000/";
export const redirectUri = "https://ashy-wave-0c6d0ea0f.4.azurestaticapps.net/";
export const clientId = "4b27aceb-ba01-4d7e-bb3b-bc114c8d1726";
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
  scopes: ["api://aeec21ea-2bcc-43b1-afb0-4aaad8f8de26/api.access"]
};
