import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import User from "../types/User";
import { AppDispatch } from "../store";
import { checkOnline } from "../store/middlewares/socket-middleware";
import useGlobalElement from "../hooks/useGlobalElement";
import useUser from "../hooks/useUser";
import Header from "../layouts/Header";
import SquareIcon from "../components/SquareIcon";
import UserAvatar from "../components/avatar/UserAvatar";
import MainChat from "../views/main-chat/MainChat";

function AccessTime({ user }: { user: User }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user && !user.lastAccessTime) dispatch(checkOnline(user.userId));
  }, [user, dispatch]);

  if (!user.isFriend) return t("user-chat.stranger", { ns: "pages" });
  if (!user.lastAccessTime) return t("user-chat.offline", { ns: "pages" });

  const time = Math.round((new Date().getTime() - user.lastAccessTime.getTime()) / (1000 * 60)); // Đơn vị phút
  if (time < 5) return t("user-chat.online", { ns: "pages" });
  if (time < 60)
    return t("user-chat.minutes", {
      ns: "pages",
      minutes: time,
    });
  if (time < 24 * 60)
    return t("user-chat.hours", {
      ns: "pages",
      hours: time / 60,
    });
  return t("user-chat.hours", {
    ns: "pages",
    days: time / (24 * 60),
  });
}

export default function UserChat() {
  const { openSetAlias, showUserProfile } = useGlobalElement();
  const { userId } = useParams();
  const user = useUser(userId as string);

  if (!userId || !user || !user.conversationId) return undefined;
  return (
    <Stack className="w-0" direction="column" flex={1}>
      <Header>
        <UserAvatar userId={userId} size={48} onClick={() => showUserProfile(userId)} />
        <Box className="flex-1 w-0">
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold" variant="h2">
              {user?.alias || user?.name}
            </Typography>
            <IconButton size="small" onClick={() => openSetAlias(userId)}>
              <SquareIcon>
                <FontAwesomeIcon icon="pen" size="xs" />
              </SquareIcon>
            </IconButton>
          </Stack>
          <Typography className="text-xs" color="secondary" variant="subtitle1">
            <AccessTime user={user} />
          </Typography>
        </Box>
      </Header>
      <Divider />
      <MainChat conversationId={user?.conversationId} />
    </Stack>
  );
}
