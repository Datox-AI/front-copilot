import { useMutation, useQuery } from "react-query";
import { snowflakeAPI } from "../../utils/snowflakeAPI";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

const normalizer = (item, level, idx) => ({
  name: item,
  level,
  id: idx + 1,
  isFetching: false,
  error: null,
  children: []
});

const snowflakeToken =
  "ver:1-hint:31546534879242-ETMsDgAAAY0ShujqABRBRVMvQ0JDL1BLQ1M1UGFkZGluZwEAABAAEBk6KyuDOSuQnmXisy3sJTwAAABQHiaPxFAxBiXrijkW465LjNU2F757pWj8R8F6X3lnuKI+YVNF6J+8C7yZaTzpgDoUCQ0YH9oHhqFfQnmZ9RHwJqIg9+5iRytgacOYUHlb8gIAFCp+hoQnT8/v/9knuI11QOFWtFba";

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

  const {
    data: columns,
    isLoading: isLoadingColumns,
    refetch: refetchColumns
  } = useQuery(
    [
      "GET_COLUMNS",
      props?.database,
      props?.schema,
      props?.table || props?.view
    ],
    () =>
      snowflakeAPI(
        `columns/${props?.database}/${props?.schema}/${
          props?.table || props?.view
        }`,
        {
          params: {
            token: snowflakeToken
          }
        }
      ),
    {
      enabled:
        !!props?.enableColumns &&
        !!props?.database &&
        !!props?.schema &&
        !!(props?.table || props?.view) &&
        !!snowflakeToken
    }
  );

  const {
    data: previewData,
    isLoading: isLoadingPreviewData,
    refetch: refetchPreviewData
  } = useQuery(
    [
      "GET_PREVIEW_DATA",
      props?.database,
      props?.schema,
      props?.table || props?.view
    ],
    () =>
      snowflakeAPI(
        `preview_data/${props?.database}/${props?.schema}/${
          props?.table || props?.view
        }`,
        {
          params: {
            token: snowflakeToken
          }
        }
      ),
    {
      enabled:
        !!props?.enablePreviewData &&
        !!props?.database &&
        !!props?.schema &&
        !!(props?.table || props?.view) &&
        !!snowflakeToken
    }
  );

  const { mutate } = useMutation(({ db_name, schema_name }) =>
    snowflakeAPI.post(
      `select_schema?token=${snowflakeToken}&db_name=${db_name}&schema_name=${schema_name}`
    )
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
                      db: db
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
                    ...db.children.map((sch, sIdx) =>
                      sch.name === schemaName
                        ? {
                            ...sch,
                            children: sch.children.map((type) =>
                              type.name === "Tables"
                                ? {
                                    ...type,
                                    children: [
                                      ...res.tables.map((tb, tIdx) => ({
                                        ...normalizer(tb, 4, tIdx),
                                        schema: normalizer(sch, 2, sIdx),
                                        db: db
                                      }))
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
                    ...db.children.map((sch, sIdx) =>
                      sch.name === schemaName
                        ? {
                            ...sch,
                            children: sch.children.map((type) =>
                              type.name === "Views"
                                ? {
                                    ...type,
                                    children: [
                                      ...res.views.map((tb, tIdx) => ({
                                        ...normalizer(tb, 4, tIdx),
                                        schema: normalizer(sch, 2, sIdx),
                                        db: db
                                      }))
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

  // children: [
  //   {
  //     ...normalizer("Views", 3, 1),
  //     schema: normalizer(sch, 2, sIdx),
  //     db: db
  //   },
  //   {
  //     ...normalizer("Tables", 3, 2),
  //     schema: normalizer(sch, 2, sIdx),
  //     db: db
  //   }
  // ]

  const checkSelectedSchema = (schemaName, dbName) => {
    mutate(
      { db_name: dbName, schema_name: schemaName },
      {
        onSuccess: (res) => {
          console.log(res);
          setStatusIsFetching(dbName, false, null, schemaName);
        },
        onError: (err) => {
          console.log(err);
          setStatusIsFetching(dbName, false, null, schemaName);
        }
      }
    );
  };

  const onSelectItem = async (item) => {
    if (item.level === 1) {
      getSchemas(item.name);
    } else if (item.level === 2) {
      setStatusIsFetching(item.db.name, true, null, item.name);
      checkSelectedSchema(item.name, item.db.name);
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

  return {
    isConnected,
    initAuth,
    databases,
    snowflakeData,
    columns,
    isLoadingColumns,
    previewData,
    isLoadingPreviewData,
    refetchPreviewData,
    refetchColumns,
    onSelectItem
  };
};

export default useSnowflakeAPI;
