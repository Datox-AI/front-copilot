import { Box } from "@mui/material";
import ColumnDetails from "..";
import Table from "../../../../components/Table";
import { snowflakeTypesIcons } from "../../../../consts/snowflake_types";
import { useLocation, useParams } from "react-router-dom";
import useSnowflakeAPI from "../../../../hooks/api/useSnowflakeAPI";
import { useMemo } from "react";

export const normalizeColumn = (name, withRender, dataIndex) => ({
  id: name,
  header: name,
  accessorKey: dataIndex,
  footer: (props) => props.column.id

  // props: {
  //   style: {
  //     minWidth: "50%"
  //   }
  // },
  // render: withRender
  //   ? (item, key) => (
  //       <Box display="flex" gap="5px" justifyContent="flex-start">
  //         {snowflakeTypesIcons[item[key].toLowerCase()]} {item[key]}
  //       </Box>
  //     )
  //   : null
});

const ColumnsTable = () => {
  const location = useLocation();
  const { columnName } = useParams();

  const { columns, isLoadingColumns } = useSnowflakeAPI({
    database: location.state?.dbName,
    schema: location.state?.schemaName,
    table: columnName,
    enableColumns: true
  });

  const cols = useMemo(
    () =>
      columns?.columns?.length > 0
        ? Object.keys(columns?.columns?.[0]).map((name) =>
            normalizeColumn(name, name === "type")
          )
        : [],
    [columns?.columns]
  );

  return (
    <ColumnDetails>
      <Table
        columns={cols}
        data={columns?.columns || []}
        isLoading={isLoadingColumns}
      />
    </ColumnDetails>
  );
};

export default ColumnsTable;
