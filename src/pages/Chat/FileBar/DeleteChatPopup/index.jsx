import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Popup from "../../../../components/Popup";
import alertImg from "../../../../assets/icons/alert.png";

const DeleteChatPopup = ({
  isOpen,
  close,
  onSubmit,
  isLoading,
  title = " Are you sure you want to close this chat?",
  description = "All chat tabs associated with this will be closed."
}) => {
  return (
    <Popup isOpen={isOpen} close={close}>
      <Box
        width={374}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img src={alertImg} width={120} height={120} alt="alert" />
        <Typography
          fontSize="24px"
          fontWeight={500}
          textAlign="center"
          marginTop="16px"
        >
          {title}
        </Typography>
        <Typography
          fontSize="16px"
          fontWeight={400}
          textAlign="center"
          marginTop="8px"
        >
          {description}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          mt="53px"
          width="100%"
          gap="10px"
        >
          <Button
            variant="contained"
            style={{
              height: 42,
              width: "48%"
            }}
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
          <Button
            variant="outlined"
            style={{
              height: 42,
              width: "48%"
            }}
            onClick={close}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Popup>
  );
};

export default DeleteChatPopup;
