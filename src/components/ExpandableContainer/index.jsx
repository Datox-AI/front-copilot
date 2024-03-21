import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function ExpandableContainer({
  children,
  initWidth,
  maxWidth,
  isOpen,
  width,
  setWidth,
  extraOffset = 0,
  style
}) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const _width = isOpen
        ? e.clientX - 280 - extraOffset
        : e.clientX - 90 - extraOffset;

      if (_width < maxWidth && _width > initWidth) {
        setWidth(_width);
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
  }, [isDragging, width, isOpen, initWidth, maxWidth, extraOffset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  return (
    <Box
      position="relative"
      width={width}
      minWidth={initWidth}
      maxWidth={maxWidth}
      overflow="visible"
      style={style}
    >
      {children}

      <button
        className={"splitter " + (isDragging && "isDragging")}
        onMouseDown={handleMouseDown}
      ></button>
    </Box>
  );
}
