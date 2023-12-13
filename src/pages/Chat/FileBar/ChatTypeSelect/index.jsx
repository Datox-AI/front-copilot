import styles from "./style.module.scss";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import useOutsideClick from "../../../../hooks/useOutsideClick";

import { useMemo, useRef, useState } from "react";
import { ReactComponent as ChatIcon } from "../../../../assets/icons/chat.svg";
import { ReactComponent as SettingsIcon } from "../../../../assets/icons/settins.svg";
import { NavLink, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

const SelectedIcon = () => (
  <svg
    className={styles.selectedIcon}
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M1.95585 5.22108C2.33588 3.60092 3.60092 2.33588 5.22109 1.95584C6.39115 1.68139 7.60885 1.68138 8.77891 1.95584C10.3991 2.33588 11.6641 3.60092 12.0442 5.22109C12.3186 6.39115 12.3186 7.60885 12.0442 8.77891C11.6641 10.3991 10.3991 11.6641 8.77891 12.0442C7.60885 12.3186 6.39115 12.3186 5.22109 12.0442C3.60092 11.6641 2.33588 10.3991 1.95585 8.77892C1.68138 7.60885 1.68138 6.39115 1.95585 5.22108Z"
      fill="#434AE9"
    />
    <path
      d="M5.39648 6.85433L6.56315 8.021L8.60482 5.8335"
      stroke="#F6F5F8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ChatTypeSelect = () => {
  const { pathname } = useLocation();

  const ref = useRef();

  const types = useMemo(() => {
    return [
      {
        link: "/chat",
        label: "ChatGPT",
        icon: <ChatIcon />
      },
      {
        link: "/integration",
        label: "Connections",
        icon: <SettingsIcon />
      }
    ];
  }, []);

  const selectedType = useMemo(() => {
    if (pathname.includes("chat")) return types[0];

    return types[1];
  }, [pathname]);

  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className={styles.typeSelect} ref={ref}>
      <h3
        onClick={() => setIsOpen((prev) => !prev)}
        className={isOpen && styles.active}
      >
        {selectedType.label}{" "}
        <ArrowForwardIosRoundedIcon
          style={{
            transform: isOpen && "rotateZ(90deg)"
          }}
        />
      </h3>
      {isOpen && (
        <ul>
          {types.map((type, t) => (
            <li key={t}>
              <NavLink to={type.link}>
                <Box display="flex" alignItems="center" gap="10px">
                  {type.icon}
                  {type.label}
                </Box>

                {selectedType.link === type.link && <SelectedIcon />}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatTypeSelect;
