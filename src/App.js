import AuthenticatedProvider from "./provider/AuthenticatedProvider";

import { RouterProvider } from "react-router-dom";
import { adminRouter, emptyRoutes, router, userRouter } from "./router";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/msal";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  const { userRoles } = useSelector((store) => store.auth);

  const routes = useMemo(() => {
    if (userRoles?.includes("Admin")) return adminRouter;
    else if (userRoles?.length > 0) return userRouter;

    return emptyRoutes;
  }, [userRoles]);

  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedProvider>
        <RouterProvider router={routes} />
      </AuthenticatedProvider>
    </MsalProvider>
  );
}

export default App;
