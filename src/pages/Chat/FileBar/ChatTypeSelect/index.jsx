import CustomSelect from "../../../../components/CustomSelect";

import { useMemo, useState } from "react";
import { ReactComponent as ChatIcon } from "../../../../assets/icons/chat.svg";
import { ReactComponent as SettingsIcon } from "../../../../assets/icons/settins.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SelectIntegrations } from "../../../../components/Popups/SelectIntegrations";
import { Box } from "@mui/material";
import {
  _integrations,
  integrationIcons
} from "../../../../consts/integrations";

const ChatTypeSelect = ({ snowflakeCredentials, activeIntegration }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openedIntegrations } = useSelector((store) => store.integrations);

  const onSelectIntegration = (type) => {
    if (type.link !== "/chat" && openedIntegrations.length === 0)
      return setIsOpenPopup(true);

    navigate(type.link);
  };

  const types = useMemo(() => {
    return [
      {
        link: "/chat",
        label: "ChatGPT",
        icon: <ChatIcon />,
        onClick: onSelectIntegration
      },
      // {
      //   link:
      //     openedIntegrations?.length > 0
      //       ? `/integration/${openedIntegrations?.[0]?.id}`
      //       : "/integration",
      //   label: "Connections",
      //   icon: <SettingsIcon />,
      //   onClick: onSelectIntegration
      // },
      ..._integrations.slice(1).map((int) => ({
        id: int.id,
        link:
          openedIntegrations?.length > 0
            ? `/integration/${int.id}`
            : "/integration",
        label: int.name,
        icon: integrationIcons[int.iconType],
        onClick: onSelectIntegration
      }))
    ];
  }, [openedIntegrations, onSelectIntegration]);

  const selectedType = useMemo(() => {
    if (pathname.includes("chat")) return types[0];

    return types.find((type) => type?.id === activeIntegration?.id);
  }, [pathname, activeIntegration]);

  const [isOpenPopup, setIsOpenPopup] = useState(false);

  return (
    <>
      <SelectIntegrations
        isOpen={isOpenPopup}
        snowflakeCredentials={snowflakeCredentials}
        toggle={() => setIsOpenPopup((prev) => !prev)}
      />
      <Box maxWidth="200px">
        <CustomSelect options={types} selectedValue={selectedType} />
      </Box>
    </>
  );
};

export default ChatTypeSelect;
