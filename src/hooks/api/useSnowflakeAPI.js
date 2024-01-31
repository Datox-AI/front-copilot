import { useMutation, useQuery } from "react-query";
import { snowflakeAPI } from "../../utils/snowflakeAPI";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  onToggleItem,
  setSnowflakeData,
  setStatusIsFetching
} from "../../redux/integrations/integrationsSlice";

const normalizer = (item, level, idx) => ({
  name: item,
  level,
  id: idx + 1,
  isFetching: false,
  error: null,
  open: false,
  children: []
});

const snowflakeToken = {
  access:
    "ver:1-hint:39500814307338-ETMsDgAAAY1eX1ZQABRBRVMvQ0JDL1BLQ1M1UGFkZGluZwEAABAAELvIVsRLxU9XQP7KZzqpfvUAAABQ2fAg13rpxwJqpjW4xW2hVroXc3GOwmqAMGtNCCjgBHSu4cZM09Hc5vA+5NY8U3FVYcHOXqp9cLaWH955pFldBRc/dVeofme7+Hhs2z3u/PkAFGf8xr1acYw08sCGsKob+sNl7BoT",

  refresh:
    "ver:2-hint:39500814315526-did:2016-ETMsDgAAAY1eX1ZKABRBRVMvQ0JDL1BLQ1M1UGFkZGluZwEAABAAEO25bhw2meqkSxx+ntZ44ekAAADw0KLbvE926SCQkujEoY6UnfnRnf8xm1UvQyyXnpz94JJhb5DCHvhlC6+RflfYMNAJHRjSOYVD2O+thVJmJ2EcKCqMLlHIQBD/1rysUgkmgm6bYS2F/SZg+AlJ1Nh2xGrTBNv/mu5yUhQnnGsBBUsIrINNBK9ezIv2m4ieAD+ZN2XigjHMBZrYo0G1VZnocXp2aJh2vrJP+ry4OvfdA7XOgxG3svrR4gPn065tstkcVo6rKb+zxLKDki/oDe9DFWivxum4ZV3hMtWwaGiWGuI3l1+gFHeALWjdWSgeYNZO6eISz1Zgcz6PnKlyiitM46vpABTCDd0NZj1eCOoIpsWYTiFp0sN6YA==",
  token_type: "Bearer",
  username: "NURMUKHAMMAD",
  scope: "refresh_token session:role:ACCOUNTADMIN",
  refresh_token_expires_in: 7775999,
  expires_in: 600,
  idpInitiated: false
};

const useSnowflakeAPI = (props) => {
  const { _snowflakeToken } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const snowflakeData = useSelector(
    (store) => store.integrations.snowflake.data
  );

  const isConnected = useMemo(
    () => !!snowflakeToken?.access,
    [snowflakeToken?.access]
  );

  const { data: credentials } = useQuery(
    ["GET_SNOWFLAKE_USER_CREDENTIALS"],
    () => snowflakeAPI.get("get_oauth"),
    {
      enabled: props?.enableUserCredentials
    }
  );

  const { data: databases } = useQuery(
    ["GET_DATABASES"],
    () =>
      snowflakeAPI.get("databases", {
        params: {
          token: snowflakeToken?.access
        }
      }),
    {
      enabled: props?.enableDatabases && !!snowflakeToken?.access
    }
  );

  const { data: schemas } = useQuery(
    ["GET_SCHEMAS", props?.database],
    () =>
      snowflakeAPI.get("schemas/" + props?.database, {
        params: {
          token: snowflakeToken?.access
        }
      }),
    {
      enabled: !!props?.database && !!snowflakeToken?.access
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
            token: snowflakeToken?.access
          }
        }
      ),
    {
      enabled:
        !!props?.enableColumns &&
        !!props?.database &&
        !!props?.schema &&
        !!(props?.table || props?.view) &&
        !!snowflakeToken?.access
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
            token: snowflakeToken?.access
          }
        }
      ),
    {
      enabled:
        !!props?.enablePreviewData &&
        !!props?.database &&
        !!props?.schema &&
        !!(props?.table || props?.view) &&
        !!snowflakeToken?.access
    }
  );

  const initAuth = useMutation((data) => snowflakeAPI.post("init_oauth", data));

  const setError = useCallback(
    (dbName, error, schemaName) => {
      if (schemaName)
        dispatch(
          setSnowflakeData(
            snowflakeData.map((db) =>
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
          )
        );
      else
        dispatch(
          setSnowflakeData(
            snowflakeData.map((db) =>
              db.name === dbName
                ? {
                    ...db,
                    error: error
                  }
                : db
            )
          )
        );
    },
    [snowflakeData]
  );

  const getSchemas = (dbName) => {
    dispatch(setStatusIsFetching({ itemName: dbName, status: true }));
    snowflakeAPI
      .get("schemas/" + dbName, {
        params: {
          token: snowflakeToken?.access
        }
      })
      .then((res) => {
        const mutatedData = snowflakeData.map((db) =>
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
        );

        dispatch(setSnowflakeData([...mutatedData]));
      })
      .catch((err) => {
        setError(dbName, err.data.detail);
      })
      .finally(() => {
        dispatch(setStatusIsFetching({ itemName: dbName, status: false }));
        dispatch(
          onToggleItem({
            itemName: dbName,
            status: true
          })
        );
      });
  };

  const checkSchema = (dbName, schemaName) =>
    snowflakeAPI
      .get("select_schema", {
        params: {
          token: snowflakeToken?.access,
          db_name: dbName,
          schema_name: schemaName
        }
      })
      .then((res) => {
        const mutatedData = snowflakeData.map((db) =>
          db.name === dbName
            ? {
                ...db,
                children: [
                  ...db.children.map((sch, sIdx) =>
                    sch.name === schemaName
                      ? {
                          ...sch,
                          open: true,
                          error:
                            !res.views &&
                            !res.tables &&
                            "No tables and views exist",
                          children: [
                            res.views
                              ? {
                                  ...normalizer("Views", 3, 1),
                                  schema: sch,
                                  db: db
                                }
                              : null,
                            res.tables
                              ? {
                                  ...normalizer("Tables", 3, 2),
                                  schema: sch,
                                  db: db
                                }
                              : null
                          ].filter((col) => col)
                        }
                      : sch
                  )
                ]
              }
            : db
        );

        dispatch(setSnowflakeData([...mutatedData]));
      })
      .finally(() => {
        dispatch(
          setStatusIsFetching({ itemName: schemaName, status: false, dbName })
        );
        dispatch(
          onToggleItem({
            itemName: schemaName,
            status: true,
            dbName
          })
        );
      });

  const getTables = (dbName, schemaName) =>
    snowflakeAPI
      .get(`tables/${dbName}/${schemaName}`, {
        params: {
          token: snowflakeToken?.access
        }
      })
      .then((res) => {
        dispatch(
          setSnowflakeData([
            ...snowflakeData.map((db) =>
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
          ])
        );
      })
      .catch((err) => {
        setError(dbName, err.data.detail, schemaName);
      })
      .finally(() => {
        dispatch(
          setStatusIsFetching({ itemName: "Tables", status: false, dbName })
        );
        dispatch(
          onToggleItem({
            itemName: "Tables",
            status: true,
            dbName
          })
        );
      });

  const getViews = (dbName, schemaName) =>
    snowflakeAPI
      .get(`views/${dbName}/${schemaName}`, {
        params: {
          token: snowflakeToken?.access
        }
      })
      .then((res) => {
        dispatch(
          setSnowflakeData([
            ...snowflakeData.map((db) =>
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
          ])
        );
      })
      .catch((err) => {
        setError(dbName, err.data.detail, schemaName);
      })
      .finally(() => {
        dispatch(
          setStatusIsFetching({ itemName: "Views", status: false, dbName })
        );

        dispatch(
          onToggleItem({
            itemName: "Views",
            status: true,
            dbName
          })
        );
      });

  const onSelectItem = async (item) => {
    switch (item.level) {
      case 1:
        return getSchemas(item.name);
      case 2:
        dispatch(
          setStatusIsFetching({
            itemName: item.name,
            status: true,
            dbName: item?.db?.name
          })
        );

        checkSchema(item?.db?.name, item.name);
        return;
      case 3:
        dispatch(
          setStatusIsFetching({
            itemName: item.name,
            status: true,
            dbName: item?.db?.name
          })
        );

        if (item.name === "Tables")
          await getTables(item.db.name, item.schema.name);
        else await getViews(item.db.name, item.schema.name);
      default:
        return;
    }
  };

  useEffect(() => {
    if (!databases || snowflakeData.length > 0) return;

    dispatch(
      setSnowflakeData([
        ...databases?.databases?.map((db, idx) => ({
          ...normalizer(db, 1, idx),
          children: []
        }))
      ])
    );
  }, [databases, snowflakeData]);

  return {
    isConnected,
    initAuth,
    databases,
    schemas,
    snowflakeData,
    columns,
    isLoadingColumns,
    previewData,
    credentials,
    isLoadingPreviewData,
    refetchPreviewData,
    refetchColumns,
    onSelectItem
  };
};

export default useSnowflakeAPI;
