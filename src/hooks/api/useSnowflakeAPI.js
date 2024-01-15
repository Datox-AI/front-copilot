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
const snowflakeToken =
  "ver:1-hint:31546534879242-ETMsDgAAAY0M1JM8ABRBRVMvQ0JDL1BLQ1M1UGFkZGluZwEAABAAEH5SrLsv1G+Cy2CaIgig2IoAAABQKMzBzE2Wvw1GlzU7MYonTpdgr9tilTQoU5U6vZESx47d7LX1rOGtthEQjDeA1v+9nVn/Kojce+m3cXAH/r1xVVe6UpI7JNruDYvR15F5juwAFOSOuD+aVXt6NyLJld9sJysfA6++";
const useSnowflakeAPI = (props) => {
  const { _snowflakeToken } = useSelector((store) => store.auth);

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

  const setStatusIsFetching = (dbName, status, schemaName, type) => {
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
                          children: [
                            ...sch.children.map((tp) =>
                              tp.name === type
                                ? { ...tp, isFetching: status }
                                : tp
                            )
                          ]
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
                    ...res.schemas.map((sch, sIdx) => ({
                      ...normalizer(sch, 2, sIdx),
                      children: [
                        {
                          ...normalizer("Views", 3, 1),
                          schema: normalizer(sch, 2, sIdx),
                          db: db
                        },
                        {
                          ...normalizer("Tables", 3, 2),
                          schema: normalizer(sch, 2, sIdx),
                          db: db
                        }
                      ]
                    }))
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
                            children: sch.children.map((type) =>
                              type.name === "Tables"
                                ? {
                                    ...type,
                                    children: [
                                      ...res.tables.map((tb, tIdx) =>
                                        normalizer(tb, 4, tIdx)
                                      )
                                    ]
                                  }
                                : type
                            )
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
        setStatusIsFetching(dbName, false, schemaName, "Tables");
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
                    ...db.children.map((sch) =>
                      sch.name === schemaName
                        ? {
                            ...sch,
                            children: sch.children.map((type) =>
                              type.name === "Views"
                                ? {
                                    ...type,
                                    children: [
                                      ...res.views.map((tb, tIdx) =>
                                        normalizer(tb, 4, tIdx)
                                      )
                                    ]
                                  }
                                : type
                            )
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
        setStatusIsFetching(dbName, false, schemaName, "Views");
      });

  const onSelectItem = async (item) => {
    if (item.level === 1) {
      getSchemas(item.name);
    } else if (item.level === 3) {
      setStatusIsFetching(item.db.name, true, item.schema.name, item.name);
      if (item.name === "Tables")
        await getTables(item.db.name, item.schema.name);
      else await getViews(item.db.name, item.schema.name);
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
