import FileBar from "../Chat/FileBar";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleIntegration } from "../../redux/integrations/integrationsSlice";
import { _integrations } from "../../consts/integrations";

const Integration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { integrationId, chatId } = useParams();
  const { openedIntegrations } = useSelector((store) => store.integrations);

  const [activeIntegration, setActiveIntegration] = useState(
    openedIntegrations[0]
  );

  const { data, refetch } = useChatsAPI({
    isGetUsers: true
  });

  const [activeChat, setActiveChat] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);

  useEffect(() => {
    if (chatId || !data) return;
    if (!data.lists) return;
    if (data.lists.length === 0) return;
    if (!activeIntegration) return;

    navigate(`${activeIntegration.id}/${data.lists[0].id}`);
  }, [chatId, data, activeIntegration]);

  useEffect(() => {
    if (openedIntegrations[0]) return;

    dispatch(toggleIntegration({ data: _integrations[1] }));
  }, [openedIntegrations, integrationId]);

  useEffect(() => {
    if (!openedIntegrations[0]) return;
    if (!integrationId) return setActiveIntegration(openedIntegrations[0]);

    setActiveIntegration(
      openedIntegrations.find((inte) => inte.id === Number(integrationId))
    );
  }, [integrationId, openedIntegrations]);

  const onCloseIntegration = (integrationId) => {
    const foundIntegrationIndex = openedIntegrations.findIndex(
      (integration) => integration.id === integrationId
    );
    const nextIntegration = openedIntegrations[foundIntegrationIndex - 1];

    dispatch(
      toggleIntegration({ data: openedIntegrations[foundIntegrationIndex] })
    );
    navigate(nextIntegration ? String(nextIntegration.id) : "/chat");
  };

  const handleSelectChat = (integration) => setActiveChat(integration);

  useEffect(() => {
    if (!chatId || !data) return;

    const foundChat = data?.lists?.find((chat) => chat.id === chatId);

    handleSelectChat(foundChat);
  }, [chatId, data?.lists]);

  return (
    <Box width="100%" display="flex">
      <FileBar
        activeIntegration={activeIntegration}
        activeChat={activeChat}
        relatedFiles={relatedFiles}
        refetch={refetch}
        hideNewChatBtn={true}
        title="Chat"
      />
      <Outlet
        context={{
          integrations: openedIntegrations,
          chats: data?.lists,
          activeChat,
          activeIntegration,
          onCloseIntegration,
          handleSelectChat,
          chatId,
          refetch,
          setRelatedFiles
        }}
      />
    </Box>
  );
};

export default Integration;
