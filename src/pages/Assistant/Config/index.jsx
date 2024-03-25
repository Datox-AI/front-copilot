import { Button } from "@mui/material";
import styles from "./style.module.scss";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

export default function AssistantConfig() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back}>
          <ChevronLeftRoundedIcon /> New GPT
        </button>

        <div className={styles.actions}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained">Create</Button>
        </div>
      </div>
      <div className={styles.body}></div>
    </div>
  );
}
