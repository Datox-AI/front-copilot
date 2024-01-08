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
    searchBy: "name"
  },
  {
    id: 2,
    name: "Snowflake",
    // to: "/integration/2",
    type: "sql",
    iconType: "snowflake"
  },
  {
    id: 3,
    name: "SharePoint",
    to: "/integration/3",
    type: "files",
    iconType: "sharepoint",
    searchBy: "itemName"
  }
  //   {
  //     id: 4,
  //     name: "Dropbox",
  //     to: "/integration/4",
  //     type: "files",
  //     iconType: "dropbox"
  //   },
  //   {
  //     id: 5,
  //     name: "Google Drive",
  //     to: "/integration/5",
  //     type: "files",
  //     iconType: "gdrive"
  //   }
];

export const integrationIcons = {
  chat: <ChatsIcon />,
  snowflake: <SnowflakeIcon />,
  sharepoint: <img src={sharepointLogo} alt="sharepoint logo" width={36} />,
  dropbox: <DropboxIcon />,
  gdrive: <GDriveIcon />
};
