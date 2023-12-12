export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 44,
          borderRadius: "8px!important",
          border: "none",
          "font-size": "16px",
          "font-weight": "500",

          "&::placeholder": {
            "font-size": "16px",
            "font-weight": "500"
          }
        },
        contained: {
          backgroundColor: "#fff",
          border: "none"
        },
        outlined: {
          backgroundColor: "transparent"
        }
      }
    }
  };
}
