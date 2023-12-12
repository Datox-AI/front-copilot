import { Box, Typography } from "@mui/material";

const Content = ({ title = "Title", children, extra, height = "75vh" }) => {
  return (
    <Box
      width="100%"
      display="flex"
      padding="16px"
      flexDirection="column"
      bgcolor="white"
      borderRadius="8px"
      overflow="scroll"
      height={height}
    >
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h2" fontSize={20} fontWeight={500}>
          {title}
        </Typography>
        {extra}
      </Box>
      {children}
    </Box>
  );
};

export default Content;
