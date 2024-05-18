import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Paper, Stack, Typography } from "@mui/material";
import User from "../../types/User";
import { AppDispatch } from "../../store";
import useGlobalElement from "../../hooks/useGlobalElement";
import { acceptFriendRequest } from "../../thunks/friendThunk";
import ActiveComponent from "../../components/ActiveComponent";
import UserAvatar from "../../components/avatar/UserAvatar";
import DeleteFriendConfirm from "../../views/DeleteFriendConfirm";

export default function RequestView({ user }: { user: User }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { showUserProfile } = useGlobalElement();
  const [deleteConfirm, setDelete] = useState(false);

  return (
    <Paper elevation={2} className="rounded-md overflow-hidden bg-emerald-50">
      <Stack
        className="box-border w-11/12 cursor-pointer p-2 mx-auto"
        flexDirection="row"
        alignItems="center"
        gap={1}
        onClick={() => showUserProfile(user.userId)}
      >
        <UserAvatar userId={user.userId} size={64} />
        <Stack alignItems="flex-start" flex={1}>
          <Typography fontWeight="bold">{user.alias || user.name}</Typography>
          <Typography fontSize="90%">{user.requestOfUser?.title || user.requestOfFriend?.title}</Typography>
          <Typography fontSize="80%">{user.requestOfUser?.description || user.requestOfFriend?.description}</Typography>
          <Typography fontSize="80%">
            {t("friend-requests.sent-time", { ns: "pages" })}
            {(user.requestOfUser || user.requestOfFriend)?.sendTime.toLocaleDateString(i18n.language)}
          </Typography>
        </Stack>
        <Stack className="place-content-center flex-col sm:flex-row" gap={1}>
          <ActiveComponent condition={user.requestOfUser}>
            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setDelete(true);
              }}
            >
              {t("btns.undo")}
            </Button>
          </ActiveComponent>
          <ActiveComponent condition={user.requestOfFriend}>
            <Button
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setDelete(true);
              }}
            >
              {t("btns.reject")}
            </Button>
          </ActiveComponent>
          <ActiveComponent condition={user.requestOfFriend}>
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(acceptFriendRequest(user.userId));
              }}
            >
              {t("btns.accept")}
            </Button>
          </ActiveComponent>
        </Stack>
      </Stack>
      <DeleteFriendConfirm friendId={user.userId} open={deleteConfirm} onClose={() => setDelete(false)} />
    </Paper>
  );
}
