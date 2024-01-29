import { Box, TextField, Typography } from "@mui/material";
import CodeGenerator from "../../CodeGenerator";

export default function IntegrationDetailsQuery({
  keywords,
  oauthTokenEndpoint,
  setOauthTokenEndpoint
}) {
  return (
    <Box display="flex" width="100%" flexDirection="column">
      <CodeGenerator keywords={keywords || []} />
      <Box width={350} style={{ margin: "40px auto 0" }}>
        <Typography fontSize={16} mb={1}>
          OAUTH_TOKEN_ENDPOINT
        </Typography>
        <TextField
          name="oauth_token_endpoint"
          value={oauthTokenEndpoint}
          onChange={(e) => setOauthTokenEndpoint(e.target.value)}
        />
      </Box>
    </Box>
  );
}
