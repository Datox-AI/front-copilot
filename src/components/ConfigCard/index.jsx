import { Button } from "@mui/material";
import styles from "./style.module.scss";

const ConfigCard = ({
  name = "Server 1",
  description = "datox.snowflakecomputing.com",
  onEdit,
  onSignIn,
  isActive
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.actions}>
        <Button variant="outlined" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="contained" onClick={onSignIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default ConfigCard;
