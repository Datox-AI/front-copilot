import styles from "./style.module.scss";
import classNames from "classnames";

const DateInput = ({ ref, ...props }) => {
  return (
    <input
      ref={ref}
      {...props}
      readOnly
      className={classNames(styles.input, props.className)}
    />
  );
};

export default DateInput;
