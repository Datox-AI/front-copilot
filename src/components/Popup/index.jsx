import styles from "./style.module.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Popup = ({ title, isOpen, close, wrapperStyle, children }) => {
  if (!isOpen) return <></>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} style={wrapperStyle}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <CloseOutlinedIcon
            className={styles.toggle}
            onClick={() => close()}
          />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Popup;
