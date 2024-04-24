import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Typography } from "@mui/material";
import Conversation from "../../../types/Conversation";
import User from "../../../types/User";
import { RootState } from "../../../store";
import ActiveComponent from "../../../components/ActiveComponent";
import MuiNavLink from "../../../components/MuiNavLink";
import UserAvatar from "../../../components/avatar/UserAvatar";
import TextWithEmojiRender from "../../../components/emoji/TextWithEmojiRender";
import ConversationMenu from "./ConversationMenu";

const style: SxProps = {
  "& .MuiListItemSecondaryAction-root .SquareIcon": {
    display: "none",
  },
  "&:hover .MuiListItemSecondaryAction-root .SquareIcon": {
    display: "flex",
  },
  "&:hover .MuiBox-root>.MuiTypography-root": {
    display: "none",
  },
};

export default function FriendConversationItem({ friend, conversation }: { friend: User; conversation: Conversation }) {
  const { t } = useTranslation();
  const userId = useSelector<RootState, string>((state) => state.auth.userId);
  const message = conversation.messages[conversation.messages.length - 1];

  return (
    <ListItem disablePadding sx={style} secondaryAction={<ConversationMenu conversation={conversation} />}>
      <ListItemButton component={MuiNavLink} to={"/User/" + friend.userId}>
        <ListItemIcon>
          <UserAvatar userId={friend.userId} size={48} />
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">
            {friend.alias || friend.name}
          </Typography>
          <Typography
            className={
              "whitespace-nowrap overflow-hidden text-ellipsis text-xs" +
              ((conversation?.seenToId || 0) < message.messageId ? "" : " text-gray-500")
            }
          >
            <ActiveComponent condition={message.fromUserId === userId}>
              {t("conversation-list.you", { ns: "layouts" })}
              {": "}
            </ActiveComponent>
            <ActiveComponent condition={message.text}>
              <TextWithEmojiRender text={message.text} />
            </ActiveComponent>
            <ActiveComponent condition={!message.text}>
              {t("conversation-list.file-message", { ns: "layouts" })}
            </ActiveComponent>
          </Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
