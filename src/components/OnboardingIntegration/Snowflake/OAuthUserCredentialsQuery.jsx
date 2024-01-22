import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography
} from "@mui/material";
import CodeGenerator from "../../CodeGenerator";

import { useState } from "react";
import { ReactComponent as Eye } from "../../../assets/icons/eye.svg";
import { ReactComponent as ClosedEye } from "../../../assets/icons/closed-eye.svg";

export default function OAuthUserCredentialsQuery({
  keywords,
  oauthClientSecret,
  setOauthClientSecret,
  oauthClientId,
  setOauthClientId
}) {
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showClientId, setShowClientId] = useState(false);

  return (
    <Box display="flex" width="100%" flexDirection="column">
      <CodeGenerator keywords={keywords || []} />

      <Box
        display="flex"
        alignItems="center"
        gap="16px"
        width="100%"
        style={{ margin: "40px auto 0" }}
      >
        <Box display="flex" flexDirection="column" width="50%">
          <Typography fontSize={16} mb={1}>
            CLIENT_SECRET
          </Typography>

          <FormControl variant="outlined">
            <OutlinedInput
              id="outlined-adornment-password"
              type={showClientSecret ? "text" : "password"}
              fullWidth
              name="oauth_client_secret"
              value={oauthClientSecret}
              onChange={(e) => setOauthClientSecret(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowClientSecret((prev) => !prev)}
                    edge="end"
                  >
                    {showClientSecret ? <ClosedEye /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="column" width="50%">
          <Typography fontSize={16} mb={1}>
            CLIENT_ID
          </Typography>

          <FormControl variant="outlined">
            <OutlinedInput
              id="outlined-adornment-password"
              type={showClientId ? "text" : "password"}
              fullWidth
              name="client_id"
              value={oauthClientId}
              onChange={(e) => setOauthClientId(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowClientId((prev) => !prev)}
                    edge="end"
                  >
                    {showClientId ? <ClosedEye /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
