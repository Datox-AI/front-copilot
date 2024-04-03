import { useDispatch } from "react-redux";
import File from "../../../../../../components/File";
import styles from "../../style.module.scss";
import { removeFile } from "../../../../../../redux/chat/chatSlice";
import classNames from "classnames";

const UploadFiles = ({ files, chatId, isMinimized, setUploadFiles }) => {
  const onRemove = (index) => {
    setUploadFiles((prev) => prev.filter((_, idx) => idx !== index));
    // dispatch(removeFile({ chatId, fileId }));
  };

  return (
    <div className={styles.files}>
      {files.map((file, idx) => (
        <div
          key={idx}
          className={classNames(styles.fileItem, {
            [styles.isMinimized]: isMinimized
          })}
        >
          <File
            // name={file.file.name}
            // type={
            //   file.file.name.split(".")[file.file.name.split(".").length - 1]
            // }
            // size={file.file.size}
            // uploadedSize={file.uploadedSize}
            // onCancel={() => onRemove(file.id)}
            name={file.name}
            type={file.name.split(".")[file.name.split(".").length - 1]}
            size={file.size}
            uploadedSize={file.size}
            onCancel={() => onRemove(idx)}
          />
        </div>
      ))}
    </div>
  );
};

export default UploadFiles;
