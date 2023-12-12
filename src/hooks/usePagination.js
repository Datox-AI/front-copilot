import { useCallback, useMemo } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { getPaginationDetailsByPathname } from "../utils/url";

const usePagination = (baseUrl) => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlDetails = getPaginationDetailsByPathname(location.search);

  const page = useMemo(
    () => (urlDetails?.page > 0 ? urlDetails?.page : 1),
    [urlDetails?.page]
  );

  const amount = useMemo(() => urlDetails?.amount || 20, [urlDetails?.amount]);

  const handlePaginate = useCallback(
    (pg) => {
      navigate({
        pathname: baseUrl,
        search: createSearchParams({
          page: pg,
          amount
        }).toString()
      });
    },
    [amount, baseUrl]
  );

  const handleAmount = useCallback(
    (count) => {
      navigate({
        pathname: baseUrl,
        search: createSearchParams({
          page,
          amount: count
        }).toString()
      });
    },
    [page, baseUrl]
  );

  return { page, amount, handleAmount, handlePaginate, filters: urlDetails };
};

export default usePagination;
