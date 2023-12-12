import styles from "../style.module.scss";
import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { elements } from "./elements";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Button, Typography, Popover, Avatar } from "@mui/material";
import { useMemo, useState } from "react";
import { setToken, setUser } from "../../../redux/auth/authSlice";
import { stringAvatar } from "../../../utils";
import { ReactComponent as LeftArrowIcon } from "../../../assets/icons/arrow-left.svg";
import { ReactComponent as RightArrowIcon } from "../../../assets/icons/arrow-right.svg";
import { Search } from "@mui/icons-material";
import { useMsal } from "@azure/msal-react";

const MenuItem = ({ to, label, icon, list }) => {
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  if (!to)
    return (
      <Box width="100%" position="relative">
        <button
          className={isOpen ? styles.activeNavLink : styles.navLink}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {icon}
          <Typography className={styles.label}>{label}</Typography>
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
                  >
                    <NavLink to={item.to}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.contextFooter}>
              <button>See more</button>
            </div>
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
      <Typography className={styles.label}>{label}</Typography>
    </NavLink>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { instance, accounts } = useMsal();

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch(setUser(null));
    dispatch(setToken(null));
  };

  const els = useMemo(() => {
    return elements;
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={styles.sidebar}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main className={styles.main}>
        <div className={styles.elements}>
          {els.map((element, e) => (
            <MenuItem
              key={e}
              to={element.to}
              label={element.label}
              icon={element.icon}
              list={element.children}
            />
          ))}
        </div>
        <Box display="flex" flexDirection="column" width="100%">
          <Button className={styles.toggle} onClick={toggleSidebar}>
            <RightArrowIcon
              style={{
                transform: isOpen && "rotateZ(180deg)"
              }}
            />
          </Button>
          <Button className={styles.profile} onClick={handleClick}>
            <Box width="80%" display="flex">
              <Avatar {...stringAvatar(accounts?.[0]?.name)} />

              {isOpen && (
                <Box
                  width="60%"
                  ml="8px"
                  height="52px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography variant="h3">{accounts?.[0]?.name}</Typography>
                  <Typography variant="h4">
                    {accounts?.[0]?.username}
                  </Typography>
                </Box>
              )}
            </Box>
            {/* <ArrowForwardIosRoundedIcon /> */}
          </Button>
        </Box>
      </main>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Button
          variant="outlinedSecondary"
          style={{
            width: 120
          }}
          // onClick={logout}
          onClick={() => {
            instance.logoutRedirect();
          }}
        >
          Logout{" "}
          <LogoutIcon
            style={{
              marginLeft: "10px",
              fontSize: 15
            }}
          />
        </Button>
      </Popover>
    </div>
  );
};

export default Sidebar;
