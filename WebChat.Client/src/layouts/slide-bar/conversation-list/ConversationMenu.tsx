import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import Conversation from "../../../types/Conversation";
import { AppDispatch } from "../../../store";
import { hideConversation } from "../../../thunks/conversationThunk";
import SquareIcon from "../../../components/SquareIcon";
import DeleteConversationConfirm from "../../../views/DeleteConversationConfirm";

export default function ConversationMenu({ conversation }: { conversation: Conversation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirm, setDelete] = useState(false);

  const message = conversation.messages[conversation.messages.length - 1];
  let time = t("conversation-list.time.few-sec", { ns: "layouts" });
  {
    let dentaTime = (new Date().getTime() - message.sendTime.getTime()) / 1000;
    dentaTime = Math.floor(dentaTime / 60);
    if (dentaTime > 0) time = t("conversation-list.time.mins", { ns: "layouts", mins: dentaTime });
    dentaTime = Math.floor(dentaTime / 60);
    if (dentaTime > 0) time = t("conversation-list.time.hours", { ns: "layouts", hours: dentaTime });
    dentaTime = Math.floor(dentaTime / 24);
    if (dentaTime > 0) time = t("conversation-list.time.days", { ns: "layouts", days: dentaTime });
  }

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleHide = () => {
    dispatch(hideConversation({ conversationId: conversation.conversationId, isHidden: true }));
    setAnchorEl(null);
  };
  const handleShow = () => {
    dispatch(hideConversation({ conversationId: conversation.conversationId, isHidden: false }));
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setDelete(true);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box className="flex justify-center align-middle">
      <Typography className="text-xs text-gray-500">{time}</Typography>
      <IconButton edge="end" onClick={handleOpen}>
        <SquareIcon>
          <FontAwesomeIcon icon="ellipsis" />
        </SquareIcon>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        {conversation?.isHidden ? (
          <MenuItem onClick={handleShow}>{t("conversation-list.menu.show", { ns: "layouts" })}</MenuItem>
        ) : (
          <MenuItem onClick={handleHide}>{t("conversation-list.menu.hidden", { ns: "layouts" })}</MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          {t("conversation-list.menu.delete", { ns: "layouts" })}
        </MenuItem>
      </Menu>
      <DeleteConversationConfirm
        conversationId={conversation.conversationId}
        open={deleteConfirm}
        onClose={() => setDelete(false)}
      />
    </Box>
  );
}
