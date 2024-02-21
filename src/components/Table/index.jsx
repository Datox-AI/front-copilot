import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel
} from "@tanstack/react-table";
import styles from "./style.module.scss";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, CircularProgress } from "@mui/material";
import { ReactComponent as SwapIcon } from "../../assets/icons/swap.svg?react";

const DragAlongCell = ({ cell }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id
  });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    borderColor: isDragging && "#0177fb"
  };

  // const value = flexRender(cell.column.columnDef.cell, cell.getContext());
  const value = cell.getValue();
  const withCut = cell.getValue()?.length > 40;

  const [showMore, setShowMore] = useState(false);

  const toggle = () => setShowMore((prev) => !prev);

  return (
    <td style={style} ref={setNodeRef}>
      {showMore && withCut ? (
        <>
          {value} <button onClick={toggle}>show less</button>
        </>
      ) : (
        <>
          {String(value).substring(0, 40)}
          {withCut && (
            <>
              ... <button onClick={toggle}>show more</button>
            </>
          )}
        </>
      )}
    </td>
  );
};

const DraggableTableHeader = ({ header, table }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id
    });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    // width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    borderColor: isDragging && "#0177fb",
    width: `calc(var(--header-${header?.id}-size) * 1px)`
  };

  return (
    <th colSpan={header.colSpan} ref={setNodeRef} style={style}>
      <div className={styles.headerBox}>
        <span>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {header.id !== "index" && (
          <button {...attributes} {...listeners}>
            <SwapIcon />
          </button>
        )}

        {header.id !== "index" && (
          <div
            {...{
              onDoubleClick: () => header.column.resetSize(),
              onMouseDown: header.getResizeHandler(),
              onTouchStart: header.getResizeHandler(),
              className: `resizer ${table.options.columnResizeDirection} ${
                header.column.getIsResizing() ? "isResizing" : ""
              }`,
              style: {}
            }}
          />
        )}
      </div>
      {header.column.getCanFilter() && header.index !== 0 ? (
        <div className={styles.filter}>
          <Filter column={header.column} table={table} />
        </div>
      ) : null}
    </th>
  );
};

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

const RCTable = ({ columns, data, isLoading }) => {
  const _cols = useMemo(
    () =>
      columns?.length > 0
        ? [
            {
              id: "index",
              header: "#",
              accessorKey: "index",
              footer: (props) => props.column.id,
              size: 50,
              minSize: 50
            },
            ...columns
          ]
        : [],
    [columns]
  );

  const _data = useMemo(() => {
    return data.map((item, idx) => ({ ...item, index: idx + 1 }));
  }, [data]);

  console.log(data, _data);

  useEffect(() => {
    setColumnOrder(() => _cols.map((c) => c?.id));
  }, [_cols]);

  const [columnOrder, setColumnOrder] = useState(() => _cols.map((c) => c?.id));

  const table = useReactTable({
    data: _data,
    columns: _cols,
    defaultColumn: {
      minSize: 50,
      size: 250
      // maxSize: 800
    },
    state: {
      columnOrder
    },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode,
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  // reorder columns after drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id);
        const newIndex = columnOrder.indexOf(over.id);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  if (isLoading)
    return (
      <Box
        width="96%"
        height={300}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={30} />
      </Box>
    );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
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
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader
                      key={header.id}
                      header={header}
                      table={table}
                    />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={column.getFilterValue()?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={column.getFilterValue()?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={column.getFilterValue() ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

export default RCTable;
