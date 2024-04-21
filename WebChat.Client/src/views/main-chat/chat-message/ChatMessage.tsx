import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import "./chat-message.css";
import { Message } from "../../../types/Conversation";
import { AppDispatch, RootState } from "../../../store";
import useUser from "../../../hooks/useUser";
import { hideMessage, removeMessage } from "../../../thunks/conversationThunk";
import ActiveComponent from "../../../components/ActiveComponent";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SquareIcon from "../../../components/SquareIcon";
import UserAvatar from "../../../components/avatar/UserAvatar";
import FileView from "./FileView";
import ImageView from "./ImageView";
import StatusView from "./StatusView";
import TextView from "./TextView";

export default function ChatMessage({ isBreak, message }: { isBreak?: boolean; message: Message }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector<RootState, string>((state) => state.auth.userId);
  const user = useUser(message.fromUserId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modal, setModal] = useState<"Hide" | "Delete" | null>(null);
  useEffect(() => {
    modal && setAnchorEl(null);
  }, [modal]);
  const handleConfirm = async () => {
    if (modal === "Hide") await dispatch(hideMessage(message));
    else if (modal === "Delete") await dispatch(removeMessage(message));
    setModal(null);
  };

  let className = "chat-message";
  if (message.fromUserId === currentUserId) className += " me";
  if (isBreak) className += " break";

  return (
    <Stack user-id={message.fromUserId} message-id={message.messageId} className={className} direction="row" gap={1}>
      <ActiveComponent condition={currentUserId !== message.fromUserId}>
        <UserAvatar userId={message.fromUserId} size={40} />
      </ActiveComponent>
      <ActiveComponent condition={currentUserId === message.fromUserId}>
        <Stack justifyContent="center">
          <IconButton className="more-btn" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <SquareIcon>
              <FontAwesomeIcon icon="ellipsis" />
            </SquareIcon>
          </IconButton>
        </Stack>
      </ActiveComponent>
      <Card variant="outlined" className="rounded-lg min-w-14">
        <CardContent className="p-3">
          <ActiveComponent condition={!message.isDeleted}>
            <Typography className="user-name text-sm mb-1.5 text-gray-600">{user?.name}</Typography>
            <ImageView message={message} />
            <FileView message={message} />
            <TextView message={message} />
            <StatusView message={message} />
          </ActiveComponent>
          <ActiveComponent condition={message.isDeleted}>
            <Typography className="text-sm text-gray-500">
              {t("chat-message.deleted-message", { ns: "views" })}
            </Typography>
          </ActiveComponent>
        </CardContent>
      </Card>
      <ActiveComponent condition={currentUserId !== message.fromUserId}>
        <Stack justifyContent="center">
          <IconButton className="more-btn" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <SquareIcon>
              <FontAwesomeIcon icon="ellipsis" />
            </SquareIcon>
          </IconButton>
        </Stack>
      </ActiveComponent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: currentUserId === message.fromUserId ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: currentUserId !== message.fromUserId ? "left" : "right",
        }}
      >
        <MenuItem sx={{ color: "error.main" }} onClick={() => setModal("Hide")}>
          {t("chat-message.hide-message", { ns: "views" })}
        </MenuItem>
        <ActiveComponent condition={currentUserId === message.fromUserId}>
          <MenuItem sx={{ color: "error.main" }} onClick={() => setModal("Delete")}>
            {t("chat-message.delete-message", { ns: "views" })}
          </MenuItem>
        </ActiveComponent>
      </Menu>
      <ConfirmDialog open={modal !== null} onConfirm={handleConfirm}>
        <ActiveComponent condition={modal === "Hide"}>
          {t("chat-message.hidden-confirm", { ns: "views" })}
        </ActiveComponent>
        <ActiveComponent condition={modal === "Delete"}>
          {t("chat-message.deleted-confirm", { ns: "views" })}
        </ActiveComponent>
      </ConfirmDialog>
    </Stack>
  );
}
