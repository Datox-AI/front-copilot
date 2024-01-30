import CustomSelect from "../../../../components/CustomSelect";

import { useMemo, useState } from "react";
import { ReactComponent as ChatIcon } from "../../../../assets/icons/chat.svg";
import { ReactComponent as SettingsIcon } from "../../../../assets/icons/settins.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SelectIntegrations } from "../../../../components/Popups/SelectIntegrations";
import { Box } from "@mui/material";

const ChatTypeSelect = () => {
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
      {
        link:
          openedIntegrations?.length > 0
            ? `/integration/${openedIntegrations?.[0]?.id}`
            : "/integration",
        label: "Connections",
        icon: <SettingsIcon />,
        onClick: onSelectIntegration
      }
    ];
  }, [openedIntegrations, onSelectIntegration]);

  const selectedType = useMemo(() => {
    if (pathname.includes("chat")) return types[0];

    return types[1];
  }, [pathname]);

  const [isOpenPopup, setIsOpenPopup] = useState(false);

  return (
    <>
      <SelectIntegrations
        isOpen={isOpenPopup}
        toggle={() => setIsOpenPopup((prev) => !prev)}
      />
      <Box maxWidth="200px">
        <CustomSelect options={types} selectedValue={selectedType} />
      </Box>
    </>
  );
};

export default ChatTypeSelect;
