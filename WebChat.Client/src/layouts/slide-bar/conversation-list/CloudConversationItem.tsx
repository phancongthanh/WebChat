import { useTranslation } from "react-i18next";
import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Typography } from "@mui/material";
import cloudImg from "../../../assets/images/cloud-img.jpg";
import Conversation from "../../../types/Conversation";
import ActiveComponent from "../../../components/ActiveComponent";
import MuiNavLink from "../../../components/MuiNavLink";
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

export default function CloudConversationItem({ conversation }: { conversation: Conversation }) {
  const { t } = useTranslation();
  const message = conversation.messages[conversation.messages.length - 1];
  return (
    <ListItem disablePadding sx={style} secondaryAction={<ConversationMenu conversation={conversation} />}>
      <ListItemButton component={MuiNavLink} to="Cloud">
        <ListItemIcon>
          <Avatar className="w-12 h-12" src={cloudImg} />
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">
            {t("conversation-list.cloud-name", { ns: "layouts" })}
          </Typography>
          <Typography className="whitespace-nowrap overflow-hidden text-ellipsis text-xs text-gray-500">
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
