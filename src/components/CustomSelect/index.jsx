import styles from "./style.module.scss";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import useOutsideClick from "../../hooks/useOutsideClick";

import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import classNames from "classnames";

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

const CustomSelect = ({
  options,
  selectedValue,
  placeholder = "No defaul values"
}) => {
  const ref = useRef();

  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className={styles.typeSelect} ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={classNames(styles.btn, isOpen && styles.active)}
      >
        {selectedValue ? selectedValue.label : placeholder}{" "}
        <ArrowForwardIosRoundedIcon
          style={{
            transform: isOpen && "rotateZ(90deg)"
          }}
        />
      </button>
      {isOpen && (
        <ul>
          {options.map((option, t) =>
            option.children?.length > 0 ? (
              <li key={t} className={styles.listItem}>
                <Box display="flex" alignItems="center" gap="10px">
                  {option.icon}
                  {option.label}
                </Box>

                <ChevronRightRoundedIcon />

                <ul>
                  {option.children.map((item, idx) => (
                    <li key={idx} onClick={() => item.onClick(item)}>
                      <NavLink to="#">
                        <Box
                          display="flex"
                          alignItems="center"
                          gap="10px"
                          width="100%"
                        >
                          {item.icon}
                          {item.label}
                        </Box>

                        {selectedValue.label === item.label && <SelectedIcon />}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={t} onClick={() => option.onClick(option)}>
                <NavLink to="#">
                  <Box display="flex" alignItems="center" gap="10px">
                    {option.icon}
                    {option.label}
                  </Box>

                  {selectedValue.label === option.label && <SelectedIcon />}
                </NavLink>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
