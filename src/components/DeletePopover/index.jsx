import styles from "./style.module.scss";

const DeletePopover = ({
  title = "Are you sure delete?",
  onCancel,
  onSubmit
}) => {
  return (
    <div className={styles.container}>
      <h4>{title}</h4>
      <div className={styles.actions}>
        <button onClick={onCancel}>No</button>
        <button onClick={onSubmit}>Yes</button>
      </div>
    </div>
  );
};

export default DeletePopover;
