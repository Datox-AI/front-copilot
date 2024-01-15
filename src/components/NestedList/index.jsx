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
  SNOWFLAKE_TEST_TOKEN_ENDPOINT
} from "../../consts/snowflake";

const NestedListItem = ({ listItem, onSelectItem, zIndex }) => {
  const [isOpen, setIsOpen] = useState(false);

  const popoverMenu = useMemo(() => {
    return [
      {
        icon: ColumnsI,
        title: <span>Columns</span>
      },
      {
        icon: DataPreviewI,
        title: <span>Data Preview</span>
      }
    ];
  }, [listItem]);

  const onClick = () => {
    setIsOpen((prev) => {
      if (!prev && listItem.children.length === 0) {
        if (listItem.level === 3) onSelectItem(listItem);
        else onSelectItem(listItem);
      }

      return !prev;
    });
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

const NestedListContainer = () => {
  const { isConnected, initAuth, snowflakeData, onSelectItem } =
    useSnowflakeAPI();

  const onAuth = () => {
    initAuth.mutate(
      {
        account_identifier: SNOWFLAKE_TEST_ACCOUNT_IDENTIFIER,
        client_id: SNOWFLAKE_TEST_CLIENT_ID,
        client_secret: SNOWFLAKE_TEST_CLIENT_SECRET,
        token_endpoint: SNOWFLAKE_TEST_TOKEN_ENDPOINT,
        redirect_uri: SNOWFLAKE_REDIRECT_URL
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
