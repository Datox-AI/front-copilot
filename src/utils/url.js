export const getPaginationDetailsByPathname = (search) => {
  const slicedPath = search.slice(1);
  const splitted = slicedPath.split("&");

  const res = {};

  splitted.forEach((item) => {
    const key = item.split("=")[0];
    const value = item.split("=")[1];

    res[key] = value;
  });

  return res;
};
