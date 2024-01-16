import { Typography } from "@mui/material";
import { ReactComponent as ClockI } from "../assets/icons/clock.svg";

export const snwoflakeTypes = {
  "VARCHAR(16777216)": "varchar(16777216)",
  "VARCHAR(3)": "varchar(3)",
  VARCHAR: "varchar",
  TIMESTAMP_LTZ: "timestamp_ltz"
};

export const snowflakeTypesIcons = {
  [snwoflakeTypes["VARCHAR(3)"]]: (
    <Typography
      fontSize="10px"
      style={{
        textDecoration: "underline"
      }}
    >
      A
    </Typography>
  ),
  [snwoflakeTypes["VARCHAR(16777216)"]]: (
    <Typography
      fontSize="10px"
      style={{
        textDecoration: "underline"
      }}
    >
      A
    </Typography>
  ),
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
