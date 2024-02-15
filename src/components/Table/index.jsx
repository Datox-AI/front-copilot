import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import { Resizable } from "react-resizable";
import styles from "./style.module.scss";

function TableBody({ table }) {
  return (
    <div
      {...{
        className: "tbody"
      }}
    >
      {table.getRowModel().rows.map((row) => (
        <div
          {...{
            key: row.id,
            className: "tr"
          }}
        >
          {row.getVisibleCells().map((cell) => {
            //simulate expensive render
            for (let i = 0; i < 10000; i++) {
              Math.random();
            }

            return (
              <div
                {...{
                  key: cell.id,
                  className: "td",
                  style: {
                    width: `calc(var(--col-${cell.column.id}-size) * 1px)`
                  }
                }}
              >
                {cell.renderValue()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

//special memoized wrapper for our table body that we will use during column resizing
export const MemoizedTableBody = React.memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
);
const columnResizeMode = "onChange";

const RCTable = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 60,
      maxSize: 800
    },
    columnResizeMode,
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className={styles.table}>
      <table
        {...{
          style: {
            width: table.getCenterTotalSize()
          }
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.index,
                    // colSpan: header.colSpan,
                    style: {
                      // width: header.getSize(),
                      width: `calc(var(--header-${header?.id}-size) * 1px)`
                    }
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <div
                    {...{
                      onDoubleClick: () => header.column.resetSize(),
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        table.options.columnResizeDirection
                      } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                      style: {}
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize()
                    }
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RCTable;
