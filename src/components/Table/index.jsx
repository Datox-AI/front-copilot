import { Skeleton, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from "./style.module.scss";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const _data = [
  {
    id: 1,
    arrival_place: "TAS",
    departure_place: "IAD",
    arrival_date: "November 19, 2023",
    departure_date: "November 20, 2023",
    agent: "Otabek Nosirov",
    status: "Подтвержден"
  }
];

const TTable = ({
  children,
  columns,
  data,
  amount = 20,
  setAmount,
  currentPage = 0,
  total = 1,
  setPage,
  page,
  height,
  isLoading
}) => {
  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div
      className={styles.container}
      style={{
        height: "calc(100vh - 90px)"
      }}
    >
      {children && <div className={styles.filter}>{children}</div>}
      <div className={styles.table}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          stickyHeader
          style={{
            border: "1px solid #E5E9EB",
            borderRadius: 8
          }}
        >
          <TableHead>
            <TableRow
              style={{
                height: "40px!important"
              }}
            >
              {columns.map((column, c) => (
                <TableCell
                  key={c}
                  {...column.attributes}
                  style={{
                    borderRight:
                      c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                  }}
                >
                  <Typography fontSize={14} fontWeight={600}>
                    {column.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      <Skeleton width={120} height={50} />
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ) : (
              data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column, c) => (
                    <TableCell
                      component="td"
                      scope="row"
                      key={c}
                      style={{
                        borderRight:
                          c !== columns.length - 1 ? "1px solid #E5E9EB" : ""
                      }}
                    >
                      {!!column.render ? (
                        <column.render data={row} />
                      ) : (
                        row[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className={styles.pagination}>
        <Pagination
          count={Math.ceil(total / amount)}
          page={page}
          onChange={(_, pg) => setPage(pg)}
          shape="rounded"
        />
        <Select
          value={amount}
          label={"Show " + amount}
          placeholder={"Show " + amount}
          onChange={handleChange}
          style={{
            width: 160
          }}
        >
          <MenuItem value={20}>Show 20</MenuItem>
          <MenuItem value={30}>Show 30</MenuItem>
          <MenuItem value={40}>Show 40</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default TTable;
