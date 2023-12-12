import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "react-query";

import { persistor, store } from "../redux/store";
import { Toaster } from "react-hot-toast";
import { CustomProvider } from "rsuite";

import ThemeCustomization from "../themes";

import "rsuite/dist/rsuite.min.css";
import { queryClient } from "../config/queryClient";

const TripoProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          <ThemeCustomization>
            <CustomProvider theme="light">{children}</CustomProvider>
          </ThemeCustomization>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default TripoProvider;
