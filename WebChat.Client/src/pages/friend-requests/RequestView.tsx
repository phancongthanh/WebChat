import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Paper, Stack, SxProps, Typography } from "@mui/material";
import User from "../../types/User";
import { AppDispatch } from "../../store";
import useGlobalElement from "../../hooks/useGlobalElement";
import { acceptFriendRequest } from "../../thunks/friendThunk";
import ActiveComponent from "../../components/ActiveComponent";
import UserAvatar from "../../components/avatar/UserAvatar";
import DeleteFriendConfirm from "../../views/DeleteFriendConfirm";

const style: SxProps = {
  boxSizing: "border-box",
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
  bgcolor: "rgba(0, 161, 242, 0.05)",
  padding: "5px 35px",
  cursor: "pointer",
};

export default function RequestView({ user }: { user: User }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { showUserProfile } = useGlobalElement();
  const [deleteConfirm, setDelete] = useState(false);

  return (
    <Paper elevation={2} sx={{ width: "80%" }}>
      <Stack
        sx={style}
        onClick={(e) => {
          e.stopPropagation();
          showUserProfile(user.userId);
        }}
      >
        <UserAvatar userId={user.userId} size={72} />
        <Stack alignItems="flex-start" flex={1}>
          <Typography fontWeight="bold">{user.alias || user.name}</Typography>
          <Typography fontSize="90%">{user.requestOfUser?.title || user.requestOfFriend?.title}</Typography>
          <Typography fontSize="80%">{user.requestOfUser?.description || user.requestOfFriend?.description}</Typography>
          <Typography fontSize="80%">
            {t("friend-requests.sent-time", { ns: "pages" })}
            {(user.requestOfUser || user.requestOfFriend)?.sendTime.toLocaleDateString(i18n.language)}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
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
