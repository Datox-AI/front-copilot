import { Box, CircularProgress } from "@mui/material";
import styles from "./style.module.scss";

const Table = ({ columns, data, isLoading }) => {
  if (isLoading)
    return (
      <Box
        width="100%"
        display="flex"
        height={250}
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
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
