import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import styles from "./style.module.scss";
import { useState } from "react";
import classNames from "classnames";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={classNames(styles.container, { [styles.closed]: !isOpen })}>
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen((prev) => !prev)}
      />
      <div className={styles.wrapper}>
        {/* <Navbar /> */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
