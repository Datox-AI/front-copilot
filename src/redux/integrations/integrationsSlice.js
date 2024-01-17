import { createSlice } from "@reduxjs/toolkit";
import { _integrations } from "../../consts/integrations";
import { findAndChangeField } from "../../utils/group";

const initialState = {
  openedIntegrations: [],
  integrationConfig: null,
  snowflake: {
    data: []
  }
};

const integrationsSlice = createSlice({
  name: "integrations",
  initialState,
  reducers: {
    toggleIntegration: (state, { payload: { data, isNotDelete = false } }) => {
      if (!data) return;

      if (
        state.openedIntegrations.find(
          (integration) => integration.id === data.id
        ) &&
        isNotDelete
      )
        return;

      if (
        state.openedIntegrations.find(
          (integration) => integration.id === data.id
        )
      )
        state.openedIntegrations = state.openedIntegrations.filter(
          (integration) => integration.id !== data.id
        );
      else state.openedIntegrations = [...state.openedIntegrations, data];
    },

    toggleIntegrationConfig: (state, { payload }) => {
      state.integrationConfig = payload;
    },

    setSnowflakeData: (state, { payload }) => {
      console.log(payload);
      state.snowflake.data = payload;
    },

    setStatusIsFetching: (state, { payload: { status, itemName, dbName } }) => {
      findAndChangeField(
        state.snowflake.data,
        itemName,
        dbName,
        "isFetching",
        status
      );
    },

    onToggleItem: (state, { payload: { itemName, status, dbName } }) => {
      findAndChangeField(
        state.snowflake.data,
        itemName,
        dbName,
        "open",
        status
      );
    }
  }
});

export const {
  toggleIntegration,
  toggleIntegrationConfig,
  setSnowflakeData,
  setStatusIsFetching,
  onToggleItem
} = integrationsSlice.actions;

export default integrationsSlice.reducer;
