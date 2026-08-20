import { ReactComponent as SnowflakeIcon } from "../assets/icons/snowflake_light.svg";
import { ReactComponent as DropboxIcon } from "../assets/icons/dropbox.svg";
import { ReactComponent as GDriveIcon } from "../assets/icons/gdrive.svg";
import { ReactComponent as ChatsIcon } from "../assets/icons/chats.svg";
import sharepointLogo from "../assets/icons/sharepoint.png";

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

export const integrationIcons = {
  chat: <ChatsIcon />,
  snowflake: <SnowflakeIcon />,
  sharepoint: <img src={sharepointLogo} alt="sharepoint logo" width={36} />,
  dropbox: <DropboxIcon />,
  gdrive: <GDriveIcon />
};
