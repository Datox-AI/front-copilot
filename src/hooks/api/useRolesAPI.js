import { useQuery } from "react-query";
import { request } from "../../config/request";

const useRolesAPI = () => {
  const { data, isLoading, refetch } = useQuery(["GET_ROLES"], () =>
    request.get("/api/users/roles")
  );

  return {
    data,
    isLoading,
    refetch
  };
};

export default useRolesAPI;
