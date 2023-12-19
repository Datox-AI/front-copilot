import { useState } from "react";
import styles from "./style.module.scss";
import { ReactComponent as NestListArrowI } from "../../assets/icons/nested-list-arrow.svg";
import { ReactComponent as ChevronDownI } from "../../assets/icons/chevron-down.svg";
import classNames from "classnames";
import useOAuth from "../../hooks/useOAuth";
import { Button } from "@mui/material";

const _data = [
  {
    id: 1,
    level: 1,
    name: "Prod_use_cases",
    children: [
      {
        id: 11,
        level: 2,
        name: "Alamo"
      },
      {
        id: 12,
        level: 2,
        name: "Alpha"
      },
      {
        id: 13,
        level: 2,
        name: "Delta",
        children: [
          {
            id: 21,
            level: 3,
            name: "View information schema"
          }
        ]
      }
    ]
  }
];

const NestedListItem = ({ listItem }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!listItem.children || listItem.children.length === 0)
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
        <button className={styles.itemMeta}>{listItem.name}</button>
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
        <ChevronDownI
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            transform: !isOpen && "rotateZ(-90deg)"
          }}
        />
        {listItem.name}
      </button>

      {isOpen && <NestedList data={listItem.children} />}
    </li>
  );
};

const NestedList = ({ data = _data }) => {
  return (
    <>
      <ul className={styles.nestedList}>
        {data.map((item, i) => (
          <NestedListItem key={i} listItem={item} />
        ))}
      </ul>
    </>
  );
};

export default NestedList;
