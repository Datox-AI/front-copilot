import styles from "./style.module.scss";
import FileItem from "../../../components/FileItem";
import NestedListContainer from "../../../components/NestedList";

import { Search } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ToggleButton from "../../../components/ToggleButton";
import classNames from "classnames";

const FilesList = ({ relatedFiles, search, isOpenContainer }) => {
  const mutatedFiles = useMemo(() => {
    return relatedFiles?.filter((file) =>
      search
        ? file.item_name?.toLowerCase()?.includes(search?.toLowerCase())
        : file
    );
  }, [search, relatedFiles]);

  console.log(relatedFiles);

  if (!relatedFiles || relatedFiles?.length === 0)
    return (
      <Typography mt={2} fontWeight={500} whiteSpace="nowrap">
        No Related Files
      </Typography>
    );

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      gap="10px"
      marginTop="20px"
      maxHeight="calc(100vh - 100px)"
      height="calc(100vh - 100px)"
      style={{
        overflowY: "auto"
      }}
    >
      {mutatedFiles?.map((file, f) => (
        <FileItem
          hideArrow={!isOpenContainer}
          name={file.ItemName || file.itemName || file.item_name || file.name}
          type={
            file.ContentType ||
            file.contentType ||
            (file.item_name || file.name).split(".")[
              (file.item_name || file.name).split(".")?.length - 1
            ]
          }
          url={file.ItemUrl || file.itemUrl || file.item_url}
        />
      ))}
    </Box>
  );
};

const RenderTypes = {
  files: FilesList,
  sql: NestedListContainer,
  assistant: FilesList
};

const OptionsBar = ({
  activeIntegration,
  chats,
  refetch,
  activeChat,
  relatedFiles,
  isAudit,
  snowflakeCredentials,
  selectSchema,
  isOpenContainer,
  toggleContainer,
  selectDatabase,
  selectedSchema,
  selectedDatabase
}) => {
  const [search, setSearch] = useState("");

  const Renderer = RenderTypes[activeIntegration?.type || "messages"];

  return (
    <div
      className={classNames(styles.filebarContainer, {
        [styles.isOpenContainer]: !isOpenContainer
      })}
    >
      <section className={styles.searchSection}>
        <ToggleButton onClick={toggleContainer} isOpen={isOpenContainer} />
        <label>
          <Search />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </section>
      <section className={styles.contentSection}>
        <div className={styles.contentList}>
          <Renderer
            chats={chats}
            refetch={refetch}
            activeChat={activeChat}
            relatedFiles={relatedFiles}
            search={search}
            isAudit={isAudit}
            snowflakeCredentials={snowflakeCredentials}
            selectSchema={selectSchema}
            selectedSchema={selectedSchema}
            selectDatabase={selectDatabase}
            selectedDatabase={selectedDatabase}
            isOpenContainer={isOpenContainer}
          />
        </div>
      </section>
    </div>
  );
};

export default OptionsBar;
