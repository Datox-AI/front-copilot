import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const _textGeneratorInit = {};

const initialState = {
  textGenerator: {},
  files: {}
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // payload = { chatId , files : [{ file }] }
    finishUploadFile: (state, { payload }) => {
      state.files[payload.chatId] = state.files[payload.chatId].map((file) =>
        file.id === payload.file.id
          ? {
              ...file,
              fileId: payload.file.fileId
            }
          : file
      );
    },
    // payload = { chatId , files : [{ file }] }
    createFiles: (state, { payload }) => {
      state.files[payload.chatId] = [
        ...(state.files[payload.chatId] || []),
        ...payload.files.map((file) => ({
          id: uuidv4(),
          file: { ...file, name: file.name, size: file.size },
          size: Number(file.size),
          uploadedSize: 0
        }))
      ];
    },
    // payload = { chatId , file : { id, uploadedSize } }
    uploadFile: (state, { payload }) => {
      state.files[payload.chatId] = state.files[payload.chatId].map((file) =>
        file.id === payload.file.id
          ? {
              ...file,
              uploadedSize: payload.file.uploadedSize
            }
          : file
      );
    },
    // payload = { chatId , fileId }
    removeFile: (state, { payload }) => {
      state.files[payload.chatId] = state.files[payload.chatId].filter(
        (file) => file.id !== payload.fileId
      );
    },
    // payload = { chatId }
    clearFiles: (state, { payload }) => {
      delete state.files[payload.chatId];
    },
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
  stopStreaming,
  createFiles,
  uploadFile,
  removeFile,
  clearFiles,
  finishUploadFile
} = chatSlice.actions;

export default chatSlice.reducer;
