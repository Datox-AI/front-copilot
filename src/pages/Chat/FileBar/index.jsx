import styles from "./style.module.scss";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import NewChatPopup from "./NewChatPopup";
import NestedList from "../../../components/NestedList";
import ChatItem from "../Chatting/TopChatList/ChatItem";
import useChatsAPI from "../../../hooks/api/useChatsAPI";
import DeleteChatPopup from "./DeleteChatPopup";
import FileItem from "../../../components/FileItem";

import { Box, Button, CircularProgress } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatTypeSelect from "./ChatTypeSelect";

const MessagesList = ({ chats, refetch, activeChat, onDelete }) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      gap="10px"
      marginTop="20px"
    >
      {chats?.map((chat) => (
        <ChatItem
          key={chat.id}
          name={chat.name}
          chatId={chat.id}
          maxWidth={true}
          isPinned={chat.pinned}
          active={activeChat?.id === chat.id}
          refetchChatList={refetch}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

const FilesList = ({ relatedFiles }) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      gap="10px"
      marginTop="20px"
    >
      {relatedFiles?.map((file, f) => (
        <FileItem
          name={file.ItemName || file.itemName}
          type={file.ContentType || file.contentType}
          url={file.ItemUrl || file.itemUrl}
        />
      ))}
    </Box>
  );
};

const RenderTypes = {
  messages: MessagesList,
  files: FilesList,
  sql: NestedList
};

const FileBar = ({
  activeIntegration,
  chats,
  refetch,
  activeChat,
  relatedFiles,
  hideNewChatBtn,
  title
}) => {
  const navigate = useNavigate();
  const { createChat, deleteChat } = useChatsAPI({});

  const [isOpen, setIsOpen] = useState(false);
  const [deletableChatId, setDeletableChatId] = useState(null);

  const toggle = () => setIsOpen((prev) => !prev);

  const Renderer = RenderTypes[activeIntegration?.type || "messages"];

  const onCreate = () => {
    createChat.mutate("Analytics", {
      onSuccess: (res) => {
        navigate(res.id);
        refetch();
      }
    });
  };

  const handleDelete = useCallback(() => {
    deleteChat.mutate(deletableChatId, {
      onSuccess: () => {
        refetch();
        setDeletableChatId(null);
        if (activeChat?.id === deletableChatId) navigate("../");
      }
    });
  }, [deletableChatId]);

  return (
    <div className={styles.filebarContainer}>
      <header>
        <Box display="flex" alignItems="center" gap="10px">
          <h2>{title}</h2>
          {!hideNewChatBtn && (
            <Button
              variant="contained"
              onClick={() => onCreate()}
              disabled={createChat.isLoading}
            >
              {createChat.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <Add
                    style={{
                      fontSize: 14
                    }}
                  />
                </>
              )}
            </Button>
          )}
        </Box>

        <ChatTypeSelect />
      </header>
      <section className={styles.searchSection}>
        <label>
          <Search />
          <input placeholder="Search" />
          <TuneRoundedIcon />
        </label>
      </section>
      <section className={styles.contentSection}>
        {/* <div className={styles.pins}>
          <h3>Pinned (0)</h3>
          <p>No pinned objects</p>
        </div> */}
        <div className={styles.contentList}>
          <Renderer
            chats={chats}
            refetch={refetch}
            activeChat={activeChat}
            onDelete={setDeletableChatId}
            relatedFiles={relatedFiles}
          />
        </div>
      </section>
      <NewChatPopup isOpen={isOpen} toggle={toggle} />
      <DeleteChatPopup
        isOpen={!!deletableChatId}
        close={() => setDeletableChatId(null)}
        onSubmit={handleDelete}
        isLoading={deleteChat.isLoading}
      />
    </div>
  );
};

export default FileBar;
