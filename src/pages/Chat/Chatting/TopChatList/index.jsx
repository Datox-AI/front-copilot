import styles from "../style.module.scss";
import ChatItem from "./ChatItem";
import IntegrationTab from "./IntegrationTab";

const TopChatList = ({
  integrations,
  chats,
  activeChat,
  activeIntegration,
  handleSelectChat,
  handleSelectIntegration,
  onCloseIntegration,
  isChat
}) => {
  return (
    <div className={styles.topChatList}>
      <div className={styles.integrationTabs}>
        {integrations.map((integration) => (
          <IntegrationTab
            integrationId={integration.id}
            icon={integration.icon}
            name={integration.name}
            active={integration.id === activeIntegration.id}
            to={integration.to}
            onClose={onCloseIntegration}
          />
        ))}
      </div>

      {!isChat && (
        <div className={styles.chatList}>
          {/* {chats.map((chat) => (
          <ChatItem active={chat.id === activeChat.id} />
        ))} */}

          <ChatItem name="File inquiry. Please..." />
          <ChatItem name="File inquiry. Please..." />
          <ChatItem name="File inquiry. Please..." />
        </div>
      )}
    </div>
  );
};

export default TopChatList;
