import AuthenticatedProvider from "./provider/AuthenticatedProvider";

import { RouterProvider } from "react-router-dom";
import { emptyRoutes, router } from "./router";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/msal";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  const { userRoles } = useSelector((store) => store.auth);

  const routes = useMemo(() => {
    // if (userRoles?.includes("Admin")) return adminRoutes;
    // else if (userRoles?.length > 0) return userRoutes;
    if (userRoles?.length) return router;
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
