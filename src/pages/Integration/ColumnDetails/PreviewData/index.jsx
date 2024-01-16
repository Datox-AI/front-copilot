import { useLocation, useParams } from "react-router-dom";
import ColumnDetails from "..";
import Table from "../../../../components/Table";
import useSnowflakeAPI from "../../../../hooks/api/useSnowflakeAPI";
import { useMemo } from "react";
import { normalizeColumn } from "../Columns";

const PreviewData = () => {
  const location = useLocation();
  const { columnName } = useParams();

  const { previewData, isLoadingPreviewData } = useSnowflakeAPI({
    database: location.state?.dbName,
    schema: location.state?.schemaName,
    table: columnName,
    enablePreviewData: true
  });

  const cols = useMemo(
    () =>
      previewData?.data_preview?.length > 0
        ? Object.keys(previewData?.data_preview?.[0]).map((name) => ({
            ...normalizeColumn(name, name === "type"),
            props: {
              style: {
                minWidth: "25%"
              }
            }
          }))
        : [],
    [previewData?.data_preview]
  );

  return (
    <ColumnDetails>
      <Table
        columns={cols}
        data={previewData?.data_preview || []}
        isLoading={isLoadingPreviewData}
      />
    </ColumnDetails>
  );
};

export default PreviewData;
