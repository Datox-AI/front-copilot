import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { ReactComponent as ChatIcon } from "../../../assets/icons/chat_test.svg";
import { ReactComponent as UsersIcon } from "../../../assets/icons/two-user.svg";
import { ReactComponent as LogsIcon } from "../../../assets/icons/copy.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/setting.svg";
import { ReactComponent as RulesIcon } from "../../../assets/icons/rules.svg";
import { _integrations } from "../../../consts/integrations";

export const elements = [
  {
    name: "chat",
    label: "Chat",
    to: "/chat",
    icon: <ChatIcon />
  },
  {
    name: "users",
    label: "Users",
    to: "/users",
    icon: <UsersIcon />
  },
  {
    name: "logs",
    label: "Audit Logs",
    to: "/logs",
    icon: <LogsIcon />
  },
  {
    name: "rules",
    label: "Rules",
    to: "/rules",
    icon: <RulesIcon />
  },
  {
    name: "integrations",
    label: "Integrations",
    icon: <SettingsIcon />,
    children: [
      ..._integrations.filter((integration) => !!integration.name)
      // {
      //   name: "amazon",
      //   label: "Amazon Redshift",
      //   to: "/integration/1"
      // },
      // {
      //   name: "server",
      //   label: "Server",
      //   to: "/integration/2"
      // },
      // {
      //   name: "snowflake",
      //   label: "Snowflake",
      //   to: "/integration/3"
      // },
      // {
      //   name: "microsoft",
      //   label: "Microsoft SQL",
      //   to: "/integration/4"
      // },
      // {
      //   name: "bloomberg",
      //   label: "Bloomberg",
      //   to: "/integration/5"
      // },
      // {
      //   name: "gdrive",
      //   label: "Google Drive",
      //   to: "/integration/6"
      // },
      // {
      //   name: "dropbox",
      //   label: "Dropbox",
      //   to: "/integration/7"
      // }
    ]
  }
];

export const userElements = [
  {
    name: "chat",
    label: "Chat",
    to: "/chat",
    icon: <ChatIcon />
  },
  {
    name: "integrations",
    label: "Integrations",
    icon: <SettingsIcon />,
    children: [..._integrations.filter((integration) => !!integration.name)]
  }
];
