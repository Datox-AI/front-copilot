import { useDispatch } from "react-redux";
import File from "../../../../../../components/File";
import styles from "../../style.module.scss";
import { removeFile } from "../../../../../../redux/chat/chatSlice";

const UploadFiles = ({ files, chatId }) => {
  const dispatch = useDispatch();
  const onRemove = (fileId) => {
    dispatch(removeFile({ chatId, fileId }));
  };

  return (
    <div className={styles.files}>
      {files.map((file, idx) => (
        <div key={idx} className={styles.fileItem}>
          <File
            name={file.file.name}
            type={
              file.file.name.split(".")[file.file.name.split(".").length - 1]
            }
            size={file.file.size}
            uploadedSize={file.uploadedSize}
            onCancel={() => onRemove(file.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default UploadFiles;
