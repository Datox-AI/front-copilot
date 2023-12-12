export default function Form(theme) {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          height: 44,
          backgroundColor: "#fff",
          borderRadius: 8,
          width: "100%"
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "font-size": "16px!important",
          "font-weight": "500!important",
          color: "#0c0c0c!important"
        }
      }
    }
  };
}
