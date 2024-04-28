import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Button, Divider, Stack, SxProps, Typography } from "@mui/material";
import emptyLAN from "../../assets/images/empty-LAN.png";
import joinedGroupsImg from "../../assets/images/joined-groups-img.png";
import Header from "../../layouts/Header";
import GroupSearchDialog from "../../layouts/slide-bar/group-contacts/GroupSearchDialog";
import ReceivedInvitationsList from "./InvitationList";
import SentRequestsList from "./RequestList";

const emptyContentStyle: SxProps = {
  "div:not(:empty)+&": {
    display: "none",
  },
};

export default function GroupRequests() {
  const { t } = useTranslation();
  const [groupSearch, setGroupSearch] = useState(false);

  return (
    <Stack direction="column" flex={1}>
      <Header>
        <Avatar className="w-12 h-12" src={joinedGroupsImg} />
        <Typography variant="h2" className="font-bold text-xl">
          {t("group-requests.title", { ns: "pages" })}
        </Typography>
      </Header>
      <Divider />
      <Box flex={1} overflow="auto">
        <SentRequestsList />
        <ReceivedInvitationsList />
      </Box>
      <Stack justifyContent="center" alignItems="center" gap={1} flex={100} sx={emptyContentStyle}>
        <img className=" w-80" src={emptyLAN} alt="empty-LAN" />
        <Typography className="text-center">{t("group-requests.empty", { ns: "pages" })}</Typography>
        <Button variant="outlined" onClick={() => setGroupSearch(true)}>
          {t("btns.search")}
        </Button>
        <GroupSearchDialog open={groupSearch} onClose={() => setGroupSearch(false)} />
      </Stack>
    </Stack>
  );
}
