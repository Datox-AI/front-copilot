import styles from "./style.module.scss";

const Table = ({ columns, data }) => {
  return (
    <table className={styles.table}>
      <thead>
        <th>
          <tr>
            {columns.map((column) => (
              <td key={column.key} {...column.props}>
                {column.name}
              </td>
            ))}
          </tr>
        </th>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {columns.map(({ key, render, props }) => (
              <td key={key + i} {...props}>
                {render ? render(item, key) : item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
