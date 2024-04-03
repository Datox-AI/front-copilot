import ColumnDetails from "..";
// import Table from "../../../../components/Table";

import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { normalizeColumn } from "../Columns";
import { useMutation } from "react-query";
import { request } from "../../../../config/request";
import RCTable from "../../../../components/Table";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { CircularProgress } from "@mui/material";

export const downloadFile = (filename, data) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const Store = () => {
  const { fileId, chatId } = useParams();

  const mutate = useMutation((data) =>
    request.post(`api/analytics_agent/${chatId}/get_stored_data`, data)
  );

  const downloadMutate = useMutation((data) =>
    request.post(`api/analytics_agent/${chatId}/download_stored_data`, data)
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

  const onDownload = () => {
    downloadMutate.mutate(
      { stored_file_id: fileId },
      {
        onSuccess: (res) => {
          downloadFile(fileId, res);
        }
      }
    );
  };

  return (
    <ColumnDetails
      actions={
        <>
          <button onClick={onDownload} disabled={downloadMutate.isLoading}>
            Download{" "}
            {downloadMutate.isLoading ? (
              <CircularProgress size={10} />
            ) : (
              <DownloadRoundedIcon fontSize="16px" />
            )}
          </button>
        </>
      }
    >
      <RCTable
        columns={cols}
        data={previewData || []}
        isLoading={mutate.isLoading}
      />
    </ColumnDetails>
  );
};

export default Store;
