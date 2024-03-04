import styles from "../style.module.scss";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import useOutsideClick from "../../../hooks/useOutsideClick";
import classNames from "classnames";

import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Tooltip, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Search } from "@mui/icons-material";
import {
  toggleIntegration,
  toggleIntegrationConfig
} from "../../../redux/integrations/integrationsSlice";

const MenuItem = ({ to, label, icon, list, isSidebarOpen }) => {
  const ref = useRef();
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const onClickIntegration = (integration) => {
    // if (!integration.to) dispatch(toggleIntegrationConfig(integration));
    // else
    dispatch(toggleIntegration({ data: integration, isNotDelete: true }));
  };

  useOutsideClick(ref, () => setIsOpen(false));

  if (!to)
    return (
      <Tooltip title={!isSidebarOpen && label} placement="right">
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
                  <input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.contextMenu}>
                <ul>
                  {list
                    ?.filter((item) =>
                      item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((item, i) => (
                      <li
                        key={i}
                        className={pathname.includes(item.to) && styles.active}
                        onClick={() => onClickIntegration(item)}
                      >
                        <NavLink to={item.configUrl ? item.configUrl : item.to}>
                          {item.name}
                        </NavLink>
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
      </Tooltip>
    );

  return (
    <Tooltip title={!isSidebarOpen && label} placement="right">
      <NavLink
        to={to}
        className={
          pathname.includes(to) ? styles.activeNavLink : styles.navLink
        }
      >
        {icon}
        <Typography
          className={classNames(styles.label, {
            [styles.isOpen]: isSidebarOpen
          })}
        >
          {label}
        </Typography>
      </NavLink>
    </Tooltip>
  );
};

export default MenuItem;
