import styles from "./style.module.scss";
import NewChatPopup from "./NewChatPopup";
import ChatItem from "../Chatting/TopChatList/ChatItem";
import useChatsAPI from "../../../hooks/api/useChatsAPI";
import DeleteChatPopup from "./DeleteChatPopup";

import ChatTypeSelect from "./ChatTypeSelect";
import ExpandMenu from "../../../components/ExandMenu";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { groupItemsByDate } from "../../../utils/group";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { integrationIcons } from "../../../consts/integrations";
import { ReactComponent as GeminiIcon } from "../../../assets/icons/gemini.svg";
import ToggleButton from "../../../components/ToggleButton";
import classNames from "classnames";
import useGetAssistantsAPI from "../../../hooks/api/useGetAssistantsAPI";

const MessagesList = ({
  activeIntegration,
  chats,
  refetch,
  activeChat,
  onDelete,
  search,
  isAudit,
  isOpenContainer
}) => {
  const mutatedChats = useMemo(() => {
    const _chats = chats?.filter((chat) =>
      search ? chat.name.toLowerCase().includes(search.toLowerCase()) : chat
    );
    // TODO
    // return _chats?.filter((chat) => chat.messagesCount !== 0);

    return _chats;
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
            link={
              activeIntegration?.id !== 1
                ? `/integration/${activeIntegration.id}/${chat.id}`
                : chat.id
            }
            active={activeChat?.id === chat.id}
            refetchChatList={refetch}
            onDelete={onDelete}
            isAudit={isAudit}
            isMinimized={!isOpenContainer}
            style={{
              width: !isOpenContainer && 36,
              maxWidth: !isOpenContainer && 36,
              minWidth: !isOpenContainer && 36,
              height: 37
            }}
          />
        ))}
      </Box>

      <Box
        flex={1}
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}
      >
        {groupedChats.map((group) => (
          <ExpandMenu title={group.date} hideTitle={!isOpenContainer}>
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
                  icon={integrationIcons[activeIntegration?.iconType]}
                  maxWidth={true}
                  isPinned={chat.pinned}
                  active={activeChat?.id === chat.id}
                  refetchChatList={refetch}
                  isMinimized={!isOpenContainer}
                  onDelete={onDelete}
                  link={
                    activeIntegration?.id !== 1
                      ? `/integration/${activeIntegration.id}/${chat.id}`
                      : chat.id
                  }
                  style={{
                    width: !isOpenContainer && 33,
                    maxWidth: !isOpenContainer && 33,
                    minWidth: !isOpenContainer && 33,
                    height: 37
                  }}
                />
              ))}
            </Box>
          </ExpandMenu>
        ))}
      </Box>
    </Box>
  );
};

const FileBar = ({
  title,
  chats,
  isAudit,
  refetch,
  assistant,
  activeChat,
  assistantId,
  relatedFiles,
  hideNewChatBtn,
  selectedSchema,
  isOpenContainer,
  toggleContainer,
  selectedDatabase,
  activeIntegration,
  snowflakeCredentials
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { createChat, deleteChat } = useChatsAPI({});
  const { snowflakeToken } = useSelector((store) => store.auth);

  const assistants = useGetAssistantsAPI({});

  const [isOpen, setIsOpen] = useState(false);
  const [deletableChatId, setDeletableChatId] = useState(null);
  const [search, setSearch] = useState("");

  const toggle = () => setIsOpen((prev) => !prev);

  const onCreate = () => {
    const payload = {
      type: activeIntegration?.dataType,
      snowflake_data: {
        ...snowflakeCredentials,
        snowflake_account: snowflakeCredentials?.account_identifier,
        database_name: selectedDatabase,
        snowflake_schema: selectedSchema
      }
    };

    if (activeIntegration?.dataType !== "Analytics")
      if (activeIntegration?.dataType !== "DataAnalytics")
        delete payload.snowflake_data;
      else {
        if (!snowflakeToken?.access)
          return toast.error(
            "Please connect to snowflake , using connect button in left bar"
          );
        if (!selectedDatabase)
          return toast.error("Please select database to create chat");
        if (!selectedSchema)
          return toast.error("Please select schema to create chat");
      }
    else delete payload.snowflake_data;

    createChat.mutate(payload, {
      onSuccess: (res) => {
        refetch();

        navigate(`${pathname}/${res.id}`, {
          relative: "route"
        });
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
    <div
      className={classNames(styles.filebarContainer, {
        [styles.isOpenContainer]: !isOpenContainer
      })}
    >
      <header>
        <Box display="flex" alignItems="center" gap="10px">
          <ToggleButton onClick={toggleContainer} isOpen={isOpenContainer} />
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

        {!isAudit && (
          <ChatTypeSelect
            assistantId={assistantId}
            assistants={assistants?.data}
            activeIntegration={activeIntegration}
            snowflakeCredentials={snowflakeCredentials}
          />
        )}
      </header>
      <section className={styles.searchSection}>
        {assistant && (
          <>
            <button
              className={styles.assistant}
              onClick={() =>
                navigate(`/assistant/config/${assistant.assistant_id}`)
              }
            >
              <Box display="flex" gap="8px" alignItems="center">
                <GeminiIcon />
                <span>{assistant.name}</span>
              </Box>
            </button>

            <Box
              display="flex"
              bgcolor="#E2E2E2"
              height="1px"
              width="100%"
              marginBottom="14px"
            ></Box>
          </>
        )}

        <label>
          <Search />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </section>
      <section
        className={classNames(styles.contentSection, {
          [styles.isOpenContainer]: !isOpenContainer
        })}
      >
        <div className={styles.contentList}>
          <MessagesList
            chats={chats}
            activeIntegration={activeIntegration}
            refetch={refetch}
            activeChat={activeChat}
            onDelete={setDeletableChatId}
            relatedFiles={relatedFiles}
            search={search}
            isAudit={isAudit}
            isOpenContainer={isOpenContainer}
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
