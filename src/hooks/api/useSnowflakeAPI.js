import { useMutation } from "react-query";
import { snowflakeAPI } from "../../utils/snowflakeAPI";

const useSnowflakeAPI = () => {
  const initAuth = useMutation((data) => snowflakeAPI.post("init_oauth", data));

  return { initAuth };
};

export default useSnowflakeAPI;
