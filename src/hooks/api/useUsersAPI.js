import { useQuery } from "react-query";
import { request } from "../../config/request";

const useUsersAPI = () => {
  const { data, isLoading, refetch } = useQuery(["GET_USERS"], () =>
    request.get("api/users")
  );

  return { data, isLoading, refetch };
};

export default useUsersAPI;
