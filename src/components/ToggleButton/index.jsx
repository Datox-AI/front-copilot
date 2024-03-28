import { IconButton } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function ToggleButton({ isOpen, ...props }) {
  return (
    <IconButton
      {...props}
      style={{
        width: 26,
        height: 26,
        minWidth: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#3D3BFF33",
        borderRadius: "5px",
        margin: "0 5px"
      }}
    >
      {isOpen ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
    </IconButton>
  );
}
