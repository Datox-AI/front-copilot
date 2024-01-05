import { useMutation, useQuery } from "react-query";
import { snowflakeAPI } from "../../utils/snowflakeAPI";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const normalizer = (item, level, idx) => ({
  name: item,
  level,
  id: idx + 1,
  isFetching: false,
  error: null
});

const useSnowflakeAPI = (props) => {
  const { snowflakeToken } = useSelector((store) => store.auth);
  const [snowflakeData, setSnowflakeData] = useState([]);

  const isConnected = useMemo(() => !!snowflakeToken, [snowflakeToken]);

  const { data: databases } = useQuery(
    ["GET_DATABASES"],
    () =>
      snowflakeAPI.get("databases", {
        params: {
          token: snowflakeToken
        }
      }),
    {
      enabled: props?.enableDatabases
    }
  );

  const initAuth = useMutation((data) => snowflakeAPI.post("init_oauth", data));

  const setStatusIsFetching = (dbName, status) =>
    setSnowflakeData((prev) =>
      prev.map((db) =>
        db.name === dbName
          ? {
              ...db,
              isFetching: status
            }
          : db
      )
    );

  const setError = (dbName, error) =>
    setSnowflakeData((prev) =>
      prev.map((db) =>
        db.name === dbName
          ? {
              ...db,
              error: error
            }
          : db
      )
    );

  const getSchemas = (dbName) => {
    setStatusIsFetching(dbName, true);
    snowflakeAPI
      .get("schemas/" + dbName, {
        params: {
          token: snowflakeToken
        }
      })
      .then((res) => {
        setSnowflakeData((prev) => [
          ...prev.map((db) =>
            db.name === dbName
              ? {
                  ...db,
                  children: [
                    ...res.schemas.map((sch, sIdx) => normalizer(sch, 2, sIdx))
                  ]
                }
              : db
          )
        ]);
      })
      .catch((err) => {
        setError(dbName, err.data.detail);
      })
      .finally(() => {
        setStatusIsFetching(dbName, false);
      });
  };

  const onSelectItem = (item) => {
    if (item.level === 1) {
      getSchemas(item.name);
    } else if (item.level === 2) {
    }
  };

  useEffect(() => {
    if (!databases) return;

    setSnowflakeData([
      ...databases?.databases?.map((db, idx) => ({
        ...normalizer(db, 1, idx),
        children: []
      }))
    ]);
  }, [databases]);

  return { isConnected, initAuth, databases, snowflakeData, onSelectItem };
};

export default useSnowflakeAPI;
