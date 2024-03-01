import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../config/request";
import {
  createFiles,
  finishUploadFile,
  uploadFile
} from "../redux/chat/chatSlice";
import { store } from "../redux/store";

const upload = (data, config) =>
  request.post("api/files/files", data, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

const useFileUpload = ({ chatId }) => {
  const dispatch = useDispatch();
  const files = useSelector((store) => store.chat.files[chatId]);

  const onUpdateFileUpload = (event, fileId) => {
    dispatch(
      uploadFile({
        chatId,
        file: {
          id: fileId,
          uploadedSize: event.loaded
        }
      })
    );
  };

  const handleUpload = useCallback(
    async (_files) => {
      dispatch(createFiles({ chatId, files: [..._files] }));

      [..._files].map(async (file) => {
        const formData = new FormData();

        // getting file from store to pass to upload progress function id
        const foundCreatedFile = store
          .getState()
          .chat.files[chatId].find(
            (_file) =>
              Number(_file.size) === Number(file.size) &&
              _file.file.name === file.name
          );

        formData.append("file", file);

        const res = await upload(formData, {
          onUploadProgress: (e) => onUpdateFileUpload(e, foundCreatedFile.id)
        });

        if (!!res)
          dispatch(
            finishUploadFile({
              chatId,
              file: { id: foundCreatedFile.id, fileId: res.blob_name }
            })
          );
      });
    },
    [files, chatId]
  );

  return { files, handleUpload };
};

export default useFileUpload;
