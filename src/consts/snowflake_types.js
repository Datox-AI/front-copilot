import { Typography } from "@mui/material";
import { ReactComponent as ClockI } from "../assets/icons/clock.svg";

export const snwoflakeTypes = {
  VARCHAR: "varchar",
  TIMESTAMP_LTZ: "timestamp_ltz"
};

export const snowflakeTypesIcons = {
  [snwoflakeTypes.VARCHAR]: (
    <Typography
      fontSize="10px"
      style={{
        textDecoration: "underline"
      }}
    >
      A
    </Typography>
  ),
  [snwoflakeTypes.TIMESTAMP_LTZ]: <ClockI />
};
