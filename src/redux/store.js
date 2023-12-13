import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import authSlice from "./auth/authSlice";
import integrationsSlice from "./integrations/integrationsSlice";
import toggleSlice from "./toggle/toggleSlice";
import chatSlice from "./chat/chatSlice";

const authPersistConfig = {
  key: "auth",
  storage
};

const integraionsPersistConfig = {
  key: "integrations",
  storage
};

const togglePersistConfig = {
  key: "toggle",
  storage
};

const chatPersistConfig = {
  key: "chat",
  storage
};

const chatPersistReducer = persistReducer(chatPersistConfig, chatSlice);
const authPersistedReducer = persistReducer(authPersistConfig, authSlice);
const togglePersistedReducer = persistReducer(togglePersistConfig, toggleSlice);
const integrationsPersistedReducer = persistReducer(
  integraionsPersistConfig,
  integrationsSlice
);

export const store = configureStore({
  reducer: {
    auth: authPersistedReducer,
    integrations: integrationsPersistedReducer,
    toggle: togglePersistedReducer,
    chat: chatPersistReducer
  },
  middleware: [thunk]
});

export const persistor = persistStore(store);
