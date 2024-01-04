import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { snowflakeAPI } from "../../../utils/snowflakeAPI";

const SnowflakeCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.search) return navigate("/");

    const fetchToken = async () => {
      snowflakeAPI
        .get("callback" + location.search)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchToken();
  }, [location]);
  return <></>;
};

export default SnowflakeCallback;
