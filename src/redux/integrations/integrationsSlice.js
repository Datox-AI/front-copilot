import { createSlice } from "@reduxjs/toolkit";
import { _integrations } from "../../consts/integrations";

const initialState = {
  openedIntegrations: [],
  integrationConfig: null
};

const integrationsSlice = createSlice({
  name: "integrations",
  initialState,
  reducers: {
    toggleIntegration: (state, { payload: { data, isNotDelete = false } }) => {
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
    }
  }
});

export const { toggleIntegration, toggleIntegrationConfig } =
  integrationsSlice.actions;

export default integrationsSlice.reducer;
