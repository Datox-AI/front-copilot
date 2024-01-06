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
  error: null,
  children: []
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
      enabled: props?.enableDatabases && !!snowflakeToken
    }
  );

  const initAuth = useMutation((data) => snowflakeAPI.post("init_oauth", data));

  const setStatusIsFetching = (dbName, status, schemaName) => {
    if (schemaName)
      setSnowflakeData((prev) =>
        prev.map((db) =>
          db.name === dbName
            ? {
                ...db,
                children: [
                  ...db.children.map((sch) =>
                    sch.name === schemaName
                      ? {
                          ...sch,
                          isFetching: status
                        }
                      : sch
                  )
                ]
              }
            : db
        )
      );
    else
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
  };

  const setError = (dbName, error, schemaName) => {
    if (schemaName)
      setSnowflakeData((prev) =>
        prev.map((db) =>
          db.name === dbName
            ? {
                ...db,
                children: [
                  ...db.children.map((sch) =>
                    sch.name === schemaName
                      ? {
                          ...sch,
                          error: error
                        }
                      : sch
                  )
                ]
              }
            : db
        )
      );
    else
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
  };

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

  const getTables = (dbName, schemaName) =>
    snowflakeAPI
      .get(`tables/${dbName}/${schemaName}`, {
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
                    ...db.children.map((sch) =>
                      sch.name === schemaName
                        ? {
                            ...sch,
                            children: [
                              ...sch.children,
                              ...res.tables.map((tb, tIdx) =>
                                normalizer(tb, 3, tIdx)
                              )
                            ]
                          }
                        : sch
                    )
                  ]
                }
              : db
          )
        ]);
      })
      .catch((err) => {
        setError(dbName, err.data.detail, schemaName);
      })
      .finally(() => {
        setStatusIsFetching(dbName, false, schemaName);
      });

  const getViews = (dbName, schemaName) =>
    snowflakeAPI
      .get(`views/${dbName}/${schemaName}`, {
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
                    ...db.children.map((sch, sIdx) =>
                      sch.name === schemaName
                        ? {
                            ...sch,
                            children: [
                              ...sch.children,
                              ...res.views.map((tb, tIdx) =>
                                normalizer(tb, 3, tIdx)
                              )
                            ]
                          }
                        : sch
                    )
                  ]
                }
              : db
          )
        ]);
      })
      .catch((err) => {
        setError(dbName, err.data.detail, schemaName);
      })
      .finally(() => {
        setStatusIsFetching(dbName, false, schemaName);
      });

  const onSelectItem = async (item, parent) => {
    if (item.level === 1) {
      getSchemas(item.name);
    } else if (item.level === 2) {
      setStatusIsFetching(parent.name, true, item.name);
      await getTables(parent.name, item.name);
      await getViews(parent.name, item.name);
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
