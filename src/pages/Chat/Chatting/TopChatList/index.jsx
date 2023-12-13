import { useNavigate } from "react-router-dom";
import useChatsAPI from "../../../../hooks/api/useChatsAPI";
import styles from "../style.module.scss";
import ChatItem from "./ChatItem";
import IntegrationTab from "./IntegrationTab";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CircularProgress } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import DeleteChatPopup from "../../FileBar/DeleteChatPopup";

const TopChatList = ({
  integrations,
  chats,
  activeChat,
  activeIntegration,
  onCloseIntegration,
  refetch
}) => {
  const navigate = useNavigate();
  const { createChat, deleteChat } = useChatsAPI({});

  const [deletableChatId, setDeletableChatId] = useState(null);

  const onCreate = () => {
    createChat.mutate("FileSearch", {
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

  const filteredChats = useMemo(
    () => chats?.filter((chat) => chat.type === "FileSearch"),
    [chats]
  );

  return (
    <div className={styles.topChatList}>
      <div className={styles.integrationTabs}>
        {integrations?.map((integration) => (
          <IntegrationTab
            key={integration.id}
            integrationId={integration.id}
            name={integration.name}
            active={integration.id === activeIntegration?.id}
            to={integration.to}
            onClose={onCloseIntegration}
            iconType={integration.iconType}
          />
        ))}
      </div>

      <div className={styles.chatList}>
        {filteredChats?.map((chat) => (
          <ChatItem
            active={chat.id === activeChat?.id}
            name={chat.name}
            isPinned={chat.pinned}
            refetchChatList={refetch}
            chatId={chat.id}
            onDelete={setDeletableChatId}
            isVerticalMoreIcon={true}
          />
        ))}

        <button
          className={styles.add}
          onClick={onCreate}
          disabled={createChat.isLoading}
        >
          {!createChat.isLoading ? (
            <AddRoundedIcon />
          ) : (
            <CircularProgress size={12} />
          )}
        </button>
      </div>

      <DeleteChatPopup
        isOpen={!!deletableChatId}
        close={() => setDeletableChatId(null)}
        onSubmit={handleDelete}
        isLoading={deleteChat.isLoading}
      />
    </div>
  );
};

export default TopChatList;
