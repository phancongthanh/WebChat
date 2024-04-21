import { useState } from "react";
import { Divider, Stack, SxProps } from "@mui/material";
import { TabType } from "../enums/TabType";
import ActiveComponent from "../components/ActiveComponent";
import MainTab from "./main-tab/MainTab";
import ContactSearch from "./slide-bar/ContactSearch";
import ConversationList from "./slide-bar/conversation-list/ConversationList";
import FriendContacts from "./slide-bar/friend-contacts/FriendContacts";
import GroupContacts from "./slide-bar/group-contacts/GroupContacts";

const style: SxProps = {
  display: {
    xs: "none",
    md: "flex",
  },
  "html:has(.start-box) &": {
    display: {
      xs: "flex",
    },
  },
  maxWidth: { md: "calc(300px + 64px)", lg: "calc(360px + 64px)" },
  minWidth: { md: "calc(300px + 64px)", lg: "calc(360px + 64px)" },
  borderColor: "secondary.main",
  borderStyle: "solid",
  borderWidth: 0,
  borderRightWidth: { sx: undefined, md: "1px" },
  transition: "width 1s ease-in-out",
};

export default function AppNav() {
  const [tab, changeTab] = useState<TabType>(TabType.Conversations);

  return (
    <Stack component="nav" direction="row" className="flex-1 h-full" sx={style}>
      <MainTab tab={tab} changeTab={changeTab} />
      <Stack height="100%" flex="1 1 auto" width={0}>
        <ContactSearch />
        <Divider />
        <ActiveComponent condition={tab === TabType.Conversations}>
          <ConversationList />
        </ActiveComponent>
        <ActiveComponent condition={tab === TabType.Friends}>
          <FriendContacts />
        </ActiveComponent>
        <ActiveComponent condition={tab === TabType.Groups}>
          <GroupContacts />
        </ActiveComponent>
      </Stack>
    </Stack>
  );
}
