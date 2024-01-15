import { Box } from "@mui/material";
import ColumnDetails from "..";
import Table from "../../../../components/Table";
import { snowflakeTypesIcons } from "../../../../consts/snowflake_types";

const _columns = [
  {
    name: "Name",
    key: "name",
    props: {
      style: {
        minWidth: "50%"
      }
    }
  },
  {
    name: "Type",
    key: "type",
    render: (item, key) => (
      <Box display="flex" gap="5px" justifyContent="flex-start">
        {snowflakeTypesIcons[item[key].toLowerCase()]} {item[key]}
      </Box>
    ),
    props: {
      style: {
        minWidth: "50%"
      }
    }
  }
];

const _data = [
  {
    name: "Comment",
    type: "Varchar"
  },
  {
    name: "Created",
    type: "Timestamp_LTZ"
  },
  {
    name: "Definition",
    type: "Varchar"
  },
  {
    name: "IS_Autoingest_Enabled",
    type: "Varchar"
  },
  {
    name: "Last_Altered",
    type: "Timestamp_LTZ"
  },
  {
    name: "Notification_Channel_Name",
    type: "Varchar"
  },
  {
    name: "Pattern",
    type: "Varchar"
  }
];

const ColumnsTable = () => {
  return (
    <ColumnDetails>
      <Table columns={_columns} data={_data} />
    </ColumnDetails>
  );
};

export default ColumnsTable;
