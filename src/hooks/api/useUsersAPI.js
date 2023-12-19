import { useMutation, useQuery } from "react-query";
import { request } from "../../config/request";

const useUsersAPI = (status) => {
  const { data, isLoading, refetch } = useQuery(["GET_USERS", status], () =>
    request.get("api/users", {
      params: {
        UserStatuses: status
      }
    })
  );

  const updateMutation = useMutation((payload) =>
    request.put("/api/users/updateuserroles", payload)
  );

  return { data, isLoading, refetch, updateMutation };
};

export default useUsersAPI;
