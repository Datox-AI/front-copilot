export const selectStyles = {
  control: () => ({
    minWidth: 300,
    height: "44px",
    padding: "0 10px 0 0",
    borderRadius: "8px",
    border: "1px",
    justifyContent: "space-between",
    display: "flex",
    backgroundColor: "#fff",
    "font-size": "16px",
    "font-weight": "500"
  }),
  value: () => ({
    "font-size": "16px",
    "font-weight": "500"
  }),
  options: (styles) => {},
  multValue: (styles) => {},
  // container: (styles) => ({
  //   // width: "100%"
  // }),
  menu: (styles) => ({
    ...styles,
    zIndex: 12
  }),
  container: (styles) => ({
    ...styles,
    width: "100%"
  }),
  placeholder: () => ({
    "font-size": "16px",
    "font-weight": "500",
    left: 12,
    position: "absolute"
  })
};
