import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuList, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ConversationType } from "../../../enums/ConversationType";
import Conversation from "../../../types/Conversation";
import Group from "../../../types/Group";
import User from "../../../types/User";
import { RootState } from "../../../store";
import ActiveComponent from "../../../components/ActiveComponent";
import CloudConversationItem from "./CloudConversationItem";
import FriendConversationItem from "./FriendConversationItem";
import GroupConversationItem from "./GroupConversationItem";

export default function ConversationList() {
  const { t } = useTranslation();
  const users = useSelector<RootState, object>((state) => state.users);
  const groups = useSelector<RootState, object>((state) => state.groups);
  const conversations = useSelector<RootState, object>((state) => state.conversations);
  const [option, setOption] = useState<"All" | "Unread" | "Hidden" | "Unfriend">("All");
  const userList = useMemo(() => Object.values(users).filter((u) => u) as User[], [users]);
  const groupList = useMemo(() => Object.values(groups).filter((u) => u) as Group[], [groups]);
  const items = Object.values(conversations)
    .filter((c: Conversation) => c && c.messages && c.messages.length)
    .filter((c: Conversation) => {
      const message = c.messages[c.messages.length - 1];
      if (option === "Unread" && message.messageId <= c.seenToId) return false;
      if (option !== "Hidden" && c.isHidden) return false;
      if (option === "Hidden" && !c.isHidden) return false;
      if (option === "Unfriend" && c.type !== ConversationType.Friend) return false;
      return true;
    })
    .sort((a: Conversation, b: Conversation) => {
      const aM = a.messages[a.messages.length - 1];
      const bM = b.messages[b.messages.length - 1];
      return bM.sendTime.getTime() - aM.sendTime.getTime();
    })
    .map((conversation: Conversation) => {
      switch (conversation.type) {
        case ConversationType.Cloud:
          return <CloudConversationItem key={conversation.conversationId} conversation={conversation} />;
        case ConversationType.Friend: {
          const friend = userList.find((u) => u.conversationId === conversation.conversationId);
          if (!friend) return undefined;
          if (option === "Unfriend" && friend.isFriend) return undefined;
          return (
            <FriendConversationItem key={conversation.conversationId} friend={friend} conversation={conversation} />
          );
        }
        case ConversationType.Group: {
          const group = groupList.find((u) => u.conversationId === conversation.conversationId);
          if (!group) return undefined;
          return <GroupConversationItem key={conversation.conversationId} group={group} conversation={conversation} />;
        }
        default:
          return undefined;
      }
    })
    .filter((c) => c);

  return (
    <Stack className="flex-1 overflow-hidden">
      <Tabs centered className="min-h-max" value={option} onChange={(_, value) => setOption(value)}>
        <Tab
          className="py-3 px-2 min-w-max min-h-max"
          label={t("conversation-list.tabs.all", { ns: "layouts" })}
          value="All"
          disableRipple
        />
        <Tab
          className="py-3 px-2 min-w-max min-h-max"
          label={t("conversation-list.tabs.unread", { ns: "layouts" })}
          value="Unread"
          disableRipple
        />
        <Tab
          className="py-3 px-2 min-w-max min-h-max"
          label={t("conversation-list.tabs.hidden", { ns: "layouts" })}
          value="Hidden"
          disableRipple
        />
        <Tab
          className="py-3 px-2 min-w-max min-h-max"
          label={t("conversation-list.tabs.unfriend", { ns: "layouts" })}
          value="Unfriend"
          disableRipple
        />
      </Tabs>
      <ActiveComponent condition={items && items.length}>
        <MenuList className="overflow-auto disable-scroll-bar flex-1 relative">{items}</MenuList>
      </ActiveComponent>
      <ActiveComponent condition={!items || !items.length}>
        <Stack alignItems="center" gap={1} marginTop={10}>
          <FontAwesomeIcon className="text-8xl text-gray-300" icon={["fas", "list-ul"]} />
          <Typography className="text-sm" color="secondary">
            {t("conversation-list.empty", { ns: "layouts" })}
          </Typography>
        </Stack>
      </ActiveComponent>
    </Stack>
  );
}
