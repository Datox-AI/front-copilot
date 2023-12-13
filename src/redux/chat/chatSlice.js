import { createSlice } from "@reduxjs/toolkit";

const _textGeneratorInit = {};

const initialState = {
  textGenerator: {}
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createTextGenerator: (state, { payload }) => {
      state.textGenerator[payload.chatId] = {
        text: "",
        isStreaming: false,
        isStopped: false,
        prompt: "",
        files: []
      };
    },
    destroyTextGenerator: (state, { payload }) => {
      delete state.textGenerator[payload.chatId];
    },
    setTextToGenerator: (state, { payload }) => {
      const prevText = state.textGenerator[payload.chatId].text;

      state.textGenerator[payload.chatId].text = prevText + payload.text;
    },
    startStreaming: (state, { payload }) => {
      state.textGenerator[payload.chatId].isStreaming = true;
    },
    stopStreaming: (state, { payload }) => {
      console.log(payload);
      state.textGenerator[payload.chatId].isStreaming = false;
    }
  }
});

export const {
  createTextGenerator,
  destroyTextGenerator,
  setTextToGenerator,
  startStreaming,
  stopStreaming
} = chatSlice.actions;

export default chatSlice.reducer;
