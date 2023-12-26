import styles from "./style.module.scss";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import NewChatPopup from "./NewChatPopup";
import NestedList from "../../../components/NestedList";
import ChatItem from "../Chatting/TopChatList/ChatItem";
import useChatsAPI from "../../../hooks/api/useChatsAPI";
import DeleteChatPopup from "./DeleteChatPopup";
import FileItem from "../../../components/FileItem";
import ChatTypeSelect from "./ChatTypeSelect";
import ExpandMenu from "../../../components/ExandMenu";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupItemsByDate } from "../../../utils/group";

const MessagesList = ({
  chats,
  refetch,
  activeChat,
  onDelete,
  search,
  isAudit
}) => {
  const mutatedChats = useMemo(() => {
    const _chats = chats?.filter((chat) =>
      search ? chat.name.toLowerCase().includes(search.toLowerCase()) : chat
    );

    return _chats?.filter((chat) => chat.messagesCount !== 0);
  }, [chats, search, isAudit]);

  const pinnedChats = useMemo(() => {
    return mutatedChats?.filter((chat) => chat.pinned);
  }, [mutatedChats]);

  const groupedChats = useMemo(() => {
    return groupItemsByDate(
      mutatedChats?.filter((chat) => !chat.pinned),
      "lastMessage"
    );
  }, [mutatedChats]);

  if (chats?.length === 0)
    return (
      <Typography mt={2} fontWeight={500}>
        No Messages
      </Typography>
    );

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      gap="10px"
      marginTop="20px"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap="10px"
        marginTop="5px"
      >
        {pinnedChats?.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            chatId={chat.id}
            maxWidth={true}
            isPinned={chat.pinned}
            active={activeChat?.id === chat.id}
            refetchChatList={refetch}
            onDelete={onDelete}
            isAudit={isAudit}
            style={{
              height: 37
            }}
          />
        ))}
      </Box>

      {groupedChats.map((group) => (
        <ExpandMenu title={group.date}>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            gap="10px"
            marginTop="5px"
          >
            {group.items?.map((chat) => (
              <ChatItem
                key={chat.id}
                isAudit={isAudit}
                name={chat.name}
                chatId={chat.id}
                maxWidth={true}
                isPinned={chat.pinned}
                active={activeChat?.id === chat.id}
                refetchChatList={refetch}
                onDelete={onDelete}
                style={{
                  height: 37
                }}
              />
            ))}
          </Box>
        </ExpandMenu>
      ))}
    </Box>
  );
};

const FilesList = ({ relatedFiles, search }) => {
  const mutatedFiles = useMemo(() => {
    return relatedFiles.filter((file) =>
      search
        ? file.itemName.toLowerCase().includes(search?.toLowerCase())
        : file
    );
  }, [search, relatedFiles]);

  if (!relatedFiles || relatedFiles?.length === 0)
    return (
      <Typography mt={2} fontWeight={500}>
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
    >
      {mutatedFiles?.map((file, f) => (
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
  title,
  isAudit
}) => {
  const navigate = useNavigate();
  const { createChat, deleteChat } = useChatsAPI({});

  const [isOpen, setIsOpen] = useState(false);
  const [deletableChatId, setDeletableChatId] = useState(null);
  const [search, setSearch] = useState("");

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

        {!isAudit && <ChatTypeSelect />}
      </header>
      <section className={styles.searchSection}>
        <label>
          <Search />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <TuneRoundedIcon /> */}
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
            search={search}
            isAudit={isAudit}
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
