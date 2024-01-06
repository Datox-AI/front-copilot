import { useState } from "react";
import styles from "./style.module.scss";
import { ReactComponent as NestListArrowI } from "../../assets/icons/nested-list-arrow.svg";
import { ReactComponent as ChevronDownI } from "../../assets/icons/chevron-down.svg";
import classNames from "classnames";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import useSnowflakeAPI from "../../hooks/api/useSnowflakeAPI";
import toast from "react-hot-toast";

const NestedListItem = ({ listItem, onSelectItem, parent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen((prev) => {
      if (!prev && listItem.children.length === 0) {
        if (listItem.level === 3) onSelectItem(listItem);
        else onSelectItem(listItem);
      }

      return !prev;
    });
  };

  if (
    // (!listItem.children || listItem.children.length === 0) &&
    listItem.level === 4
    // (listItem.level === 2 && listItem.error)
  )
    return (
      <li
        className={classNames(
          styles.nestedItem,
          styles["level" + listItem.level],
          styles.child
        )}
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
          <button className={styles.itemMeta}>{listItem.name}</button>
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
        account_identifier: "kiprdnq-kl02065",
        client_id: "8Vkzs7JybsAPLS/LOIbKZVSdKhs=",
        client_secret: "V5kf16P0oGdIq6f+pDolqn8IAMvhijnQhwX1DrzOj7I=",
        token_endpoint:
          "https://hc47250.uae-north.azure.snowflakecomputing.com/oauth/token-request",
        redirect_uri: "https://copilot.datox.ai/callback/snowflake"
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
