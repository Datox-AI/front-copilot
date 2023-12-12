import React from "react";
import AsyncSelect from "react-select/async";
import { selectStyles } from "./styles";

const TSelect = ({ loadOptions, ...props }) => {
  return (
    <AsyncSelect
      loadOptions={loadOptions}
      {...props}
      styles={{
        ...selectStyles,
        ...props.styles,
        control: () => ({
          ...selectStyles.control(),
          ...props?.styles?.control()
        })
      }}
    />
  );
};

export default TSelect;
