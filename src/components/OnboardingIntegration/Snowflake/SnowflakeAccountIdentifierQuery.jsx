import { Box, TextField, Typography } from "@mui/material";
import snowflakeTipImage from "../../../assets/images/snowflake_tip.png";

export default function SnowflakeAccountIdentifierQuery({
  accountIdentifier,
  setAccountIdentifier
}) {
  return (
    <Box width={350} style={{ margin: "0 auto" }}>
      <Typography fontSize={16} mb={1}>
        ACCOUNT IDENTIFIER
      </Typography>
      <TextField
        name="account_identifier"
        value={accountIdentifier}
        onChange={(e) => setAccountIdentifier(e.target.value)}
      />
    </Box>
  );
}

export const SnowflakeAccountIdentifierTip = () => {
  return (
    <Box display="flex" flexDirection="column">
      <img src={snowflakeTipImage} alt="snowflake image tip" />
      <Typography fontSize={18} fontWeight={600} textAlign="left" mt={2}>
        On the bottom left corner of your homepage in Snowflake:
      </Typography>

      <Box width="100%" display="flex" gap="16px" mt="12px">
        <Box width="33%" display="flex" alignItems="center" gap="8px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#0177FB" />
          </svg>

          <Typography fontSize={14} fontWeight={400}>
            Click on account dropdown
          </Typography>
        </Box>
        <Box width="33%" display="flex" alignItems="center" gap="8px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#0177FB" />
          </svg>

          <Typography fontSize={14} fontWeight={400}>
            Hover over to account number
          </Typography>
        </Box>
        <Box width="33%" display="flex" alignItems="center" gap="8px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#0177FB" />
          </svg>

          <Typography fontSize={14} fontWeight={400}>
            Copy account identifier
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
