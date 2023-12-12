import { Button } from "@mui/material";
import styles from "../style.module.scss";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { elements } from "../Sidebar/elements";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const label = useMemo(
    () => elements.find((item) => pathname.includes(item.to))?.label,
    [pathname]
  );

  const showApplicationBtn = useMemo(() => {
    return pathname === "/orders/" || pathname === "/orders";
  }, [pathname]);

  return (
    <div className={styles.navbar}>
      <h2>{label}</h2>
    </div>
  );
};

export default Navbar;
