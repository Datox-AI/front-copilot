import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import styles from "./style.module.scss";
import { useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { makeToggle } from "../../redux/toggle/toggleSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  const { isOpen } = useSelector((store) => store.toggle);

  const toggle = () => {
    dispatch(makeToggle());
  };

  return (
    <div className={classNames(styles.container, { [styles.closed]: !isOpen })}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggle} />
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
