import styles from "../style.module.scss";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import useOutsideClick from "../../../hooks/useOutsideClick";

import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Search } from "@mui/icons-material";
import { toggleIntegration } from "../../../redux/integrations/integrationsSlice";
import classNames from "classnames";

const MenuItem = ({ to, label, icon, list, isSidebarOpen }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const onClickIntegration = (integration) => {
    dispatch(toggleIntegration({ data: integration, isNotDelete: true }));
  };

  useOutsideClick(ref, () => setIsOpen(false));

  if (!to)
    return (
      <Box width="100%" position="relative" ref={ref}>
        <button
          className={isOpen ? styles.activeNavLink : styles.navLink}
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            justifyContent: "space-between"
          }}
        >
          <Box display="flex" alignItems="center">
            {icon}
            <Typography
              className={classNames(styles.label, {
                [styles.isOpen]: isSidebarOpen
              })}
            >
              {label}
            </Typography>
          </Box>
          {isSidebarOpen && (
            <ArrowForwardIosRoundedIcon
              style={{
                fontSize: 16,
                transform: isOpen && "rotateZ(90deg)"
              }}
            />
          )}
        </button>
        {list.length > 0 && isOpen && (
          <div className={styles.context}>
            <div className={styles.contextHeader}>
              <label>
                <Search />
                <input placeholder="Search" />
              </label>
            </div>
            <div className={styles.contextMenu}>
              <ul>
                {list.map((item, i) => (
                  <li
                    key={i}
                    className={pathname.includes(item.to) && styles.active}
                    onClick={() => onClickIntegration(item)}
                  >
                    <NavLink to={item.to}>{item.name}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
            {/* <div className={styles.contextFooter}>
                <button>See more</button>
              </div> */}
          </div>
        )}
      </Box>
    );

  return (
    <NavLink
      to={to}
      className={pathname.includes(to) ? styles.activeNavLink : styles.navLink}
    >
      {icon}
      <Typography
        className={classNames(styles.label, { [styles.isOpen]: isSidebarOpen })}
      >
        {label}
      </Typography>
    </NavLink>
  );
};

export default MenuItem;
