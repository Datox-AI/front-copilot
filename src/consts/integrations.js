import { ReactComponent as SnowflakeIcon } from "../assets/icons/snowflake_light.svg";
import { ReactComponent as DropboxIcon } from "../assets/icons/dropbox.svg";
import { ReactComponent as GDriveIcon } from "../assets/icons/gdrive.svg";
import { ReactComponent as ChatsIcon } from "../assets/icons/chats.svg";
import { ReactComponent as SharepoingIcon } from "../assets/icons/sharepoint.svg";
import { ReactComponent as AssistantIcon } from "../assets/icons/assistant.svg";

export const _integrations = [
  {
    id: 1,
    name: null,
    to: "/chat",
    type: "messages",
    iconType: "chat",
    searchBy: "name",
    dataType: "Analytics"
  },
  {
    id: 2,
    name: "Snowflake",
    type: "sql",
    iconType: "snowflake",
    configUrl: "/configs/snowflake",
    dataType: "DataAnalytics"
  },
  {
    id: 3,
    name: "SharePoint",
    to: "/integration/3",
    type: "files",
    iconType: "sharepoint",
    searchBy: "itemName",
    dataType: "FileSearch"
  }
];

export const _assistantIntegrations = {
  id: 4,
  name: "Assistant",
  to: null,
  type: "assistant",
  iconType: "assistant",
  searchBy: "itemName",
  dataType: "assistant"
};

export const integrationIcons = {
  chat: <ChatsIcon />,
  snowflake: <SnowflakeIcon />,
  sharepoint: <SharepoingIcon />,
  dropbox: <DropboxIcon />,
  gdrive: <GDriveIcon />,
  assistant: <AssistantIcon />
};
