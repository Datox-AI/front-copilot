import ColumnDetails from "..";
// import Table from "../../../../components/Table";

import { useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { normalizeColumn } from "../Columns";
import { useMutation } from "react-query";
import { request } from "../../../../config/request";
import RCTable from "../../../../components/Table";

const Store = () => {
  const { fileId, chatId } = useParams();

  const mutate = useMutation((data) =>
    request.post(`api/analytics_agent/${chatId}/get_stored_data`, data)
  );

  const [previewData, setPreviewData] = useState([]);

  const cols = useMemo(
    () =>
      previewData?.length > 0
        ? Object.keys(previewData?.[0]).map((name) => ({
            ...normalizeColumn(name, name === "type", name)
          }))
        : [],
    [previewData]
  );

  useEffect(() => {
    mutate.mutate(
      {
        stored_file_id: fileId
      },
      {
        onSuccess: (res) => {
          setPreviewData(res?.data);
        }
      }
    );
  }, [fileId]);

  return (
    <ColumnDetails>
      <RCTable
        columns={cols}
        data={previewData || []}
        isLoading={mutate.isLoading}
      />
    </ColumnDetails>
  );
};

export default Store;
