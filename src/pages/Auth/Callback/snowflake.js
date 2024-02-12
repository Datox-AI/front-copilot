import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { snowflakeAPI } from "../../../utils/snowflakeAPI";
import { useDispatch } from "react-redux";
import {
  setSnowflakeRefreshToken,
  setSnowflakeToken
} from "../../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { Box, CircularProgress } from "@mui/material";

const SnowflakeCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location.search) return navigate("/");

    const fetchToken = async () => {
      snowflakeAPI
        .get("api/snowflake_integration/callback" + location.search)
        .then((res) => {
          dispatch(setSnowflakeToken(res.access_token));
          dispatch(setSnowflakeRefreshToken(res.refresh_token));
        })
        .catch((err) => {
          toast.error(err.data.detail);
        })
        .finally(() => {
          navigate("/integration/2");
        });
    };

    fetchToken();
  }, [location]);

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="15px"
    >
      <CircularProgress size={50} />
      <p>Loading...</p>
    </Box>
  );
};

export default SnowflakeCallback;
