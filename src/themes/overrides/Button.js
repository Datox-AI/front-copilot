// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const disabledStyle = {
    "&.Mui-disabled": {
      backgroundColor: theme.palette.grey[200]
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          color: "#fff",
          "text-transform": "none",
          height: 30,
          display: "flex",
          alignItems: "center",
          "border-radius": "10px"
        },
        contained: {
          ...disabledStyle,
          backgroundColor: "#434ae9",
          color: "#fff"
        },
        outlined: {
          ...disabledStyle,
          color: theme.palette.primary.main
        },
        outlinedSecondary: {
          backgroundColor: "rgba(255, 242, 242, 1)",
          color: theme.palette.primary.main,

          "&:hover": {
            color: "white",
            backgroundColor: theme.palette.primary.main,
            "&:hover svg": {
              color: "white!important"
            }
          }
        },
        containedSecondary: {
          background: "rgba(134, 134, 134, 1)",
          border: '1px solid "rgba(134, 134, 134, 1)"',

          "&:hover": {
            color: "rgba(134, 134, 134, 1)",
            border: '1px solid "rgba(134, 134, 134, 1)"'
          }
        },
        containedSuccess: {
          background: "rgba(0, 191, 65, 1)",
          border: "1px solid rgba(0, 191, 65, 1)",

          "&:hover": {
            background: "rgba(0, 191, 65, 1)",
            border: "1px solid rgba(0, 191, 65, 1)",
            opacity: 0.6
          }
        }
      }
    }
  };
}
