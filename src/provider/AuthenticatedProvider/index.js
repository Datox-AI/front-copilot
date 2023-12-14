/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { useEffect, useState } from "react";
import { loginRequest } from "../../config/msal";
import { InteractionStatus } from "@azure/msal-browser";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setIsAdmin,
  setToken,
  setUser,
  setUserRoles
} from "../../redux/auth/authSlice";
import jwtDecode from "jwt-decode";

function AuthenticatedProvider({ children }) {
  const dispatch = useDispatch();

  const { instance, inProgress, accounts } = useMsal();

  useEffect(() => {
    const accessTokenRequest = {
      ...loginRequest,
      account: accounts[0]
    };

    if (inProgress === InteractionStatus.None) {
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
    }
  }, [instance, accounts, inProgress]);

  return <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
}

export default AuthenticatedProvider;
