import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import classNames from "classnames";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useCallback } from "react";

export const tabStatuses = {
  DONE: "done",
  ACTIVE: "active",
  EMPTY: "empty"
};

const Badges = {
  [tabStatuses.DONE]: () => (
    <span className={classNames(styles.badge, styles.done)}>
      <CheckRoundedIcon />
    </span>
  ),
  [tabStatuses.ACTIVE]: ({ children }) => (
    <span className={classNames(styles.badge, styles.active)}>{children}</span>
  ),
  [tabStatuses.EMPTY]: ({ children }) => (
    <span className={styles.badge}>{children}</span>
  )
};

const TabItem = ({ id, label, status, index }) => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    if (status === tabStatuses.DONE) navigate(id);
  }, [status, id]);

  const Badge = Badges[status];

  return (
    <button
      className={classNames(styles.tab, {
        [styles.active]: status === tabStatuses.ACTIVE
      })}
      onClick={onClick}
    >
      <Badge>{index}</Badge>
      <p className={styles.label}>{label}</p>
    </button>
  );
};

//  tabs = [{ id, label , status , index }]
//  status = ['done','active','empty' ]

const Tabs = ({ tabs }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab, t) => (
        <TabItem
          key={t}
          id={tab.id}
          index={t + 1}
          label={tab.label}
          status={tab.status}
        />
      ))}
    </div>
  );
};

export default Tabs;
