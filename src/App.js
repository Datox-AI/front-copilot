import AuthenticatedProvider from "./provider/AuthenticatedProvider";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/msal";

export const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedProvider>
        <RouterProvider router={router} />
      </AuthenticatedProvider>
    </MsalProvider>
  );
}

export default App;
