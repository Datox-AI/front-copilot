import styles from "./style.module.scss";
import classNames from "classnames";

import { ReactComponent as ChevronDownI } from "../../../assets/icons/chevron-down.svg";
import { ReactComponent as CloseI } from "../../../assets/icons/close.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ColumnDetails = ({ children }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState(243);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaY = startY.current - e.clientY; // Adjust the calculation here
        const newHeight = height + deltaY;
        startY.current = e.clientY;

        setIsOpen(newHeight !== 0);

        if (newHeight <= 600) setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, height]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startY.current = e.clientY;
  };

  useEffect(() => {
    if (isOpen) setHeight(243);
    else setHeight(0);
  }, [isOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.togglerWrapper} onMouseDown={handleMouseDown}>
        <span></span>
        <ChevronDownI
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            transform: !isOpen && `rotateZ(180deg)`
          }}
        />

        <button onClick={() => navigate("../../")}>
          Close <CloseI />
        </button>
      </div>
      <div
        className={classNames(styles.content, { [styles.isOpen]: isOpen })}
        style={{
          height: `${height}px`,
          resize: "vertical",
          overflowY: "auto"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ColumnDetails;
