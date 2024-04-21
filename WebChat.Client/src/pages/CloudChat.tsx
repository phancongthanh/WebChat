import { useTranslation } from "react-i18next";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import cloudImg from "../assets/images/cloud-img.jpg";
import useAuth from "../hooks/useAuth";
import Header from "../layouts/Header";
import MainChat from "../views/main-chat/MainChat";

export default function CloudChat() {
  const { t } = useTranslation();
  const { conversationId } = useAuth();
  return (
    <Stack className="w-0" direction="column" flex={1}>
      <Header>
        <Avatar className="w-12 h-12" src={cloudImg} />
        <Box className="flex-1">
          <Typography className="text-lg font-bold" variant="h2">
            {t("cloud-chat.title", { ns: "pages" })}
          </Typography>
          <Typography className="text-xs" color="secondary" variant="subtitle1">
            {t("cloud-chat.sub-title", { ns: "pages" })}
          </Typography>
        </Box>
      </Header>
      <Divider />
      <MainChat conversationId={conversationId} />
    </Stack>
  );
}
