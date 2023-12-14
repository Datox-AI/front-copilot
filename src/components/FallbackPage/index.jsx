import style from "./style.module.scss";

import { jwtDecode } from "jwt-decode";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { setToken, setUser, setUserRoles } from "../../redux/auth/authSlice";
import { Button } from "@mui/material";
import { loginRequest } from "../../config/msal";

const FallbackPage = () => {
  const dispatch = useDispatch();

  const { instance, accounts } = useMsal();

  const onClick = () => {
    const accessTokenRequest = {
      ...loginRequest,
      account: accounts[0]
    };

    instance
      .acquireTokenSilent(accessTokenRequest)
      .then((accessTokenResponse) => {
        // Acquire token silent success
        let accessToken = accessTokenResponse.accessToken;

        dispatch(setToken(accessTokenResponse.accessToken));
        dispatch(setUser(accessTokenResponse.account));

        const decoded = jwtDecode(accessToken);

        dispatch(setUserRoles(decoded?.roles || []));
      })
      .catch((error) => {
        // if (error instanceof InteractionRequiredAuthError) {
        instance.acquireTokenRedirect(accessTokenRequest);
        // }
        console.log(error);
      });
  };

  return (
    <div className={style.container}>
      <h2>Contact your administrator</h2>
      <p>Please contact with administrator</p>
      <Button onClick={onClick}>Login</Button>
    </div>
  );
};

export default FallbackPage;
