import FileBar from "../Chat/FileBar";
import useChatsAPI from "../../hooks/api/useChatsAPI";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleIntegration } from "../../redux/integrations/integrationsSlice";
import { _integrations } from "../../consts/integrations";
import toast from "react-hot-toast";

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
    if (!integrationId) return;
    if (openedIntegrations[0]) return;

    dispatch(
      toggleIntegration({
        data: _integrations.find((int) => int.id === integrationId)
      })
    );
  }, [openedIntegrations, integrationId]);

  useEffect(() => {
    if (!integrationId) {
      toast.error("No integrations has been opened yet");
      return;
    }
    if (openedIntegrations.length === 0) return;
    if (!activeIntegration && openedIntegrations.length === 0)
      return navigate("/chat");

    const _integration = openedIntegrations?.find(
      (inte) => inte.id === Number(integrationId)
    );

    if (!_integration) {
      const newIntegration = _integrations.find(
        (int) => int.id === Number(integrationId)
      );

      dispatch(toggleIntegration({ data: newIntegration }));
      setActiveIntegration(newIntegration);
      return;
    }

    setActiveIntegration(_integration);
  }, [integrationId, openedIntegrations, activeIntegration]);

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

  if (!integrationId) return <Navigate to="../" />;

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
