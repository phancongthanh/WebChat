import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Button, Divider, Stack, SxProps, Typography } from "@mui/material";
import emptyLAN from "../../assets/images/empty-LAN.png";
import friendRequestsImg from "../../assets/images/friend-requests-img.png";
import Header from "../../layouts/Header";
import FriendSearchDialog from "../../layouts/slide-bar/friend-contacts/FriendSearchDialog";
import ReceivedRequestsList from "./ReceivedRequestsList";
import SentRequestsList from "./SentRequestsList";

const emptyContentStyle: SxProps = {
  "div:not(:empty)+&": {
    display: "none",
  },
};

export default function FriendRequests() {
  const { t } = useTranslation();
  const [friendSearch, setFriendSearch] = useState(false);

  return (
    <Stack direction="column" flex={1}>
      <Header>
        <Avatar className="w-12 h-12" src={friendRequestsImg} />
        <Typography variant="h2" className="font-bold text-xl">
          {t("friend-requests.title", { ns: "pages" })}
        </Typography>
      </Header>
      <Divider />
      <Box className="mx-auto w-11/12 md:w-4/5" flex={1} overflow="auto">
        <ReceivedRequestsList />
        <SentRequestsList />
      </Box>
      <Stack justifyContent="center" alignItems="center" gap={1} flex={100} sx={emptyContentStyle}>
        <img className=" w-80" src={emptyLAN} alt="empty-LAN" />
        <Typography className="text-center">{t("friend-requests.empty", { ns: "pages" })}</Typography>
        <Button variant="outlined" onClick={() => setFriendSearch(true)}>
          {t("btns.add-friend")}
        </Button>
        <FriendSearchDialog open={friendSearch} onClose={() => setFriendSearch(false)} />
      </Stack>
    </Stack>
  );
}
