import styles from "./style.module.scss";
import classNames from "classnames";
import PopoverMenu from "../PopoverMenu";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";

import { ReactComponent as MoreVertI } from "../../assets/icons/vertical-dots.svg";
import { useMemo, useState } from "react";
import { ReactComponent as NestListArrowI } from "../../assets/icons/nested-list-arrow.svg";
import { ReactComponent as ColumnsI } from "../../assets/icons/columns.svg";
import { ReactComponent as DataPreviewI } from "../../assets/icons/data-preview.svg";
import { ReactComponent as ChevronDownI } from "../../assets/icons/chevron-down.svg";
import { Box, Button, CircularProgress } from "@mui/material";
import {
  SNOWFLAKE_REDIRECT_URL,
  SNOWFLAKE_TEST_ACCOUNT_IDENTIFIER,
  SNOWFLAKE_TEST_CLIENT_ID,
  SNOWFLAKE_TEST_CLIENT_SECRET,
  SNOWFLAKE_TEST_TOKEN_ENDPOINT,
  SNOWFLAKE_TEST_WAREHOUSE
} from "../../consts/snowflake";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onToggleItem } from "../../redux/integrations/integrationsSlice";
import CustomSelect from "../CustomSelect";

const NestedListItem = ({ listItem, onSelectItem, zIndex }) => {
  const { chatId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isOpen = listItem.open;

  const popoverMenu = useMemo(() => {
    return [
      {
        icon: ColumnsI,
        title: <span>Columns</span>,
        onClick: () =>
          navigate(`/integration/2/${chatId}/columns/${listItem.name}`, {
            state: {
              dbName: listItem.db.name,
              schemaName: listItem.schema.name.name
            }
          })
      },
      {
        icon: DataPreviewI,
        title: <span>Data Preview</span>,
        onClick: () =>
          navigate(`/integration/2/${chatId}/preview/${listItem.name}`, {
            state: {
              dbName: listItem.db.name,
              schemaName: listItem.schema.name.name
            }
          })
      }
    ];
  }, [listItem, chatId]);

  const onClick = () => {
    if (!listItem.open && listItem.children.length === 0) {
      if (listItem.level === 3 || listItem.level === 2) onSelectItem(listItem);
      else onSelectItem(listItem);
    }

    dispatch(
      onToggleItem({
        itemName: listItem.name,
        status: !listItem.open,
        dbName: listItem?.db?.name
      })
    );
  };

  if (listItem.level === 4)
    return (
      <li
        className={classNames(
          styles.nestedItem,
          styles["level" + listItem.level],
          styles.child
        )}
        style={{
          position: "relative",
          zIndex
        }}
      >
        {listItem.level !== 1 && (
          <NestListArrowI className={styles.nestedArrow} />
        )}
        {listItem.error ? (
          <button
            className={styles.itemMeta}
            style={{
              color: "red"
            }}
          >
            {listItem.error}
          </button>
        ) : (
          <button className={styles.itemMeta}>
            <span>{listItem.name}</span>
            <PopoverMenu mainIcon={<MoreVertI />} data={popoverMenu} />
          </button>
        )}
      </li>
    );

  return (
    <li
      className={classNames(
        styles.nestedItem,
        styles["level" + listItem.level]
      )}
    >
      {listItem.level !== 1 && (
        <NestListArrowI className={styles.nestedArrow} />
      )}
      <button className={styles.itemMeta}>
        {listItem.isFetching ? (
          <CircularProgress size={14} />
        ) : (
          <ChevronDownI
            onClick={onClick}
            style={{
              transform: !isOpen && "rotateZ(-90deg)"
            }}
          />
        )}
        <span>{listItem.name}</span>
      </button>

      {isOpen &&
        (!listItem.error ? (
          <NestedList
            data={listItem.children}
            parent={listItem}
            onSelectItem={onSelectItem}
          />
        ) : (
          <button
            className={styles.itemMeta}
            style={{
              color: "red"
            }}
          >
            {listItem.error}
          </button>
        ))}
    </li>
  );
};

const NestedList = ({ data, onSelectItem, parent }) => {
  return (
    <ul className={styles.nestedList}>
      {data.map((item, i) => (
        <NestedListItem
          key={i}
          parent={parent}
          listItem={item}
          onSelectItem={onSelectItem}
          zIndex={data.length - i}
        />
      ))}
    </ul>
  );
};

const NestedListContainer = ({ selectedDatabase, selectedSchema, refetch }) => {
  const {
    isConnected,
    initAuth,
    snowflakeData,
    onSelectItem,
    databases,
    schemas
  } = useSnowflakeAPI({
    enableDatabases: true,
    database: selectedDatabase
  });

  const mutatedDatabases = useMemo(() => {
    if (!databases) return [];

    return databases.map((db) => ({
      label: db,
      onClick: (db) => console.log(db)
    }));
  }, [databases]);

  const mutatedSchemas = useMemo(() => {
    if (!schemas) return [];

    return schemas.map((sch) => ({
      label: sch,
      onClick: (sch) => console.log(sch)
    }));
  }, [schemas]);

  const onAuth = () => {
    initAuth.mutate(
      {
        account_identifier: SNOWFLAKE_TEST_ACCOUNT_IDENTIFIER,
        client_id: SNOWFLAKE_TEST_CLIENT_ID,
        client_secret: SNOWFLAKE_TEST_CLIENT_SECRET,
        token_endpoint: SNOWFLAKE_TEST_TOKEN_ENDPOINT,
        redirect_uri: SNOWFLAKE_REDIRECT_URL,
        manual_warehouse: SNOWFLAKE_TEST_WAREHOUSE
      },
      {
        onSuccess: (res) => {
          window.location.replace(res.authorization_url);
        },
        onError: (err) => {
          toast.err(err.data.detail);
        }
      }
    );
  };

  return (
    <Box display="flex" width="100%" flexDirection="column" my={2}>
      <Box width="100%" display="flex" gap="10px" mb={2}>
        <Box width="50%">
          <CustomSelect
            options={mutatedDatabases}
            selectedValue={
              !!selectedDatabase && {
                label: selectedDatabase
              }
            }
            placeholder="No database"
          />
        </Box>
        <Box width="50%">
          <CustomSelect
            options={mutatedSchemas}
            selectedValue={
              !!selectedSchema && {
                label: selectedSchema
              }
            }
            placeholder="No schema"
          />
        </Box>
      </Box>

      {!isConnected ? (
        <Button variant="contained" onClick={onAuth}>
          Connect
        </Button>
      ) : (
        <NestedList data={snowflakeData} onSelectItem={onSelectItem} />
      )}
    </Box>
  );
};

export default NestedListContainer;
