import { useLocation, useParams } from "react-router-dom";
import ColumnDetails from "..";
import Table from "../../../../components/Table";
import useSnowflakeAPI from "../../../../hooks/api/useSnowflakeAPI";
import { useMemo } from "react";
import { normalizeColumn } from "../Columns";
import { useMutation } from "react-query";
import { request } from "../../../../config/request";

const Store = () => {
  const location = useLocation();
  const { fileId, chatId } = useParams();

  const mutate = useMutation((data) =>
    request.post(`api/analytics_agent/${chatId}/get_stored_data`, data)
  );

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

export default Store;
