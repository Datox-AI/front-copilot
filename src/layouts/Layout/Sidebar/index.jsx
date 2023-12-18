import styles from "../style.module.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuItem from "./MenuItem";

import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import { elements, userElements } from "./elements";
import { Box, Button, Typography, Popover, Avatar } from "@mui/material";
import { useMemo, useState } from "react";
import { stringAvatar } from "../../../utils";
import { ReactComponent as RightArrowIcon } from "../../../assets/icons/arrow-right.svg";
import { useMsal } from "@azure/msal-react";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { instance, accounts } = useMsal();
  const { userRoles } = useSelector((store) => store.auth);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const els = useMemo(() => {
    if (userRoles?.includes("Admin")) return elements;

    return userElements;
  }, [userRoles]);

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
              isSidebarOpen={isOpen}
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
            <Box width="100%" display="flex">
              <Avatar {...stringAvatar(accounts?.[0]?.name || "DATOX USER")} />

              {isOpen && (
                <Box
                  width="calc(100% - 42px)"
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
