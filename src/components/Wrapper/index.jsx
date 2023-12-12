import classNames from "classnames";
import styles from "./style.module.scss";

const Wrapper = ({ children, className, ...props }) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      {children}
    </div>
  );
};

export default Wrapper;
