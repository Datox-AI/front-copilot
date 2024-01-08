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
    name: "audit",
    label: "Audit Logs",
    to: "/audit",
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
    children: [..._integrations.filter((integration) => !!integration.name)]
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
