import styles from "./style.module.scss";
import classNames from "classnames";

import { useRef, useState } from "react";
import { ChevronRight, Search } from "@mui/icons-material";
import { ReactComponent as CheckedI } from "../../../../assets/icons/checked.svg";
import useOutsideClick from "../../../../hooks/useOutsideClick";

const SnowflakeDropdown = ({
  databases,
  schemas,
  selectedDatabase,
  selectedSchema,
  onSelectDatabase,
  onSelectSchema,
  label
}) => {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => setIsOpen(false));

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.container} ref={ref}>
      <button
        className={classNames(styles.toggler, { [styles.active]: isOpen })}
        onClick={toggle}
      >
        <span>{label}</span>

        <ChevronRight
          style={{
            transform: isOpen && "rotateZ(90deg)"
          }}
        />
      </button>

      {isOpen && (
        <div className={styles.wrapper}>
          <div className={styles.dropdownDb}>
            <DropdownWrapper
              data={databases}
              selectedItem={selectedDatabase}
              onSelect={onSelectDatabase}
            />
          </div>
          {!!selectedDatabase && schemas.length > 0 && (
            <div className={styles.dropdownSchema}>
              <DropdownWrapper
                data={schemas}
                selectedItem={selectedSchema}
                onSelect={onSelectSchema}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DropdownWrapper = ({ data, selectedItem, onSelect }) => {
  const [query, setQuery] = useState("");

  return (
    <ul className={styles.dropdown}>
      <li className={styles.search}>
        <Search />
        <input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </li>
      {data
        ?.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        ?.map((item) => (
          <li
            key={item}
            onClick={() => onSelect(item)}
            className={item === selectedItem && styles.active}
          >
            <button>{item}</button>
            {item === selectedItem && <CheckedI />}
          </li>
        ))}
    </ul>
  );
};
export default SnowflakeDropdown;
