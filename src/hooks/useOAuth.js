export const RESPONSE_TYPE = "token";
export const OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
export const REDIRECT_URI = process.env.REACT_APP_OAUTH_REDIRECT_URL;
export const SCOPES =
  "https%3A//www.googleapis.com/auth/drive.metadata.readonly";
export const OAUTH_SERVER_URI = "https://accounts.google.com/o/oauth2/v2/auth";

export const config = `include_granted_scopes=true&scope=${SCOPES}&
    include_granted_scopes=true&
    response_type=${RESPONSE_TYPE}&
    state=state_parameter_passthrough_value&
    redirect_uri=${REDIRECT_URI}&
    client_id=${OAUTH_CLIENT_ID}`;

const useOAuth = () => {
  const login = () => {
    window.location.replace(`${OAUTH_SERVER_URI}?${config}`);
  };
  return { login };
};

export default useOAuth;
