import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, IconButton, List, ListItem, Stack, Typography } from "@mui/material";
import backgroundAvatar from "../assets/images/background-avatar.jpg";
import { Gender } from "../enums/Gender";
import { AppDispatch } from "../store";
import useUser from "../hooks/useUser";
import { acceptFriendRequest, changeBlockStatus } from "../thunks/friendThunk";
import ActiveComponent from "../components/ActiveComponent";
import AsyncButton from "../components/AsyncButton";
import Modal from "../components/Modal";
import MuiNavLink from "../components/MuiNavLink";
import SquareIcon from "../components/SquareIcon";
import UserAvatar from "../components/avatar/UserAvatar";
import AddFriendDialog from "./AddFriendDialog";
import DeleteFriendConfirm from "./DeleteFriendConfirm";
import SetAliasDialog from "./SetAliasDialog";

export default function UserProfileDialog({
  open,
  userId,
  onClose,
}: {
  open: boolean;
  userId?: string;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const user = useUser(userId as string);
  const dispatch = useDispatch<AppDispatch>();
  const [modal, setModal] = useState<"Alias" | "Add-Friend" | "Delete" | null>(null);

  return (
    <Modal open={Boolean(user) && open} title={t("user-profile-dialog.title", { ns: "component" })} onClose={onClose}>
      <Stack gap={2}>
        <Box>
          <Box marginBottom="50px" position="relative">
            <img
              style={{
                margin: "-16px -24px 0",
                width: "360px",
                height: "180px",
                objectFit: "cover",
              }}
              src={backgroundAvatar}
              alt="Background"
            />
            <Stack direction="row" justifyContent="center" className="w-full absolute -bottom-1/4">
              {userId && <UserAvatar userId={userId} size={96} />}
            </Stack>
          </Box>
          <Box textAlign="center" position="relative">
            <Typography className=" text-xl">{user?.alias || user?.name}</Typography>
            <IconButton className="absolute top-0 right-5" onClick={() => setModal("Alias")}>
              <SquareIcon>
                <FontAwesomeIcon icon="pen" size="xs" />
              </SquareIcon>
            </IconButton>
          </Box>
        </Box>
        <Stack direction="row" justifyContent="space-around">
          <Button
            variant="outlined"
            size="small"
            component={MuiNavLink}
            to={"/User/" + user?.userId}
            onClick={() => onClose()}
          >
            {t("btns.chat")}
          </Button>
          <ActiveComponent
            condition={!user?.isFriend && !user?.requestOfUser && !user?.requestOfFriend && !user?.blocked}
          >
            <Button
              variant="contained"
              size="small"
              disabled={user?.beBlocked}
              title={user?.beBlocked ? t("user-profile-dialog.user-is-blocked", { ns: "component" }) : undefined}
              onClick={() => setModal("Add-Friend")}
            >
              {t("btns.add-friend")}
            </Button>
          </ActiveComponent>
          <ActiveComponent condition={user?.isFriend}>
            <Button variant="outlined" size="small" color="error" onClick={() => setModal("Delete")}>
              {t("btns.delete-friend")}
            </Button>
          </ActiveComponent>
          <ActiveComponent condition={user?.requestOfUser}>
            <Button variant="outlined" size="small" color="error" onClick={() => setModal("Delete")}>
              {t("btns.undo")}
            </Button>
          </ActiveComponent>
          <ActiveComponent condition={user?.requestOfFriend}>
            <Button variant="outlined" size="small" color="error" onClick={() => setModal("Delete")}>
              {t("btns.reject")}
            </Button>
            <AsyncButton
              variant="contained"
              size="small"
              disabled={user?.beBlocked}
              title={user?.beBlocked ? t("user-profile-dialog.user-is-blocked", { ns: "component" }) : undefined}
              onClick={async () => userId && (await dispatch(acceptFriendRequest(userId)))}
            >
              {t("btns.accept")}
            </AsyncButton>
          </ActiveComponent>
          <ActiveComponent condition={!user?.requestOfFriend && !user?.requestOfUser}>
            <AsyncButton
              variant={user?.blocked ? "contained" : "outlined"}
              size="small"
              color="warning"
              onClick={async () =>
                userId && (await dispatch(changeBlockStatus({ friendId: userId, isBlock: !user?.blocked })))
              }
            >
              {user?.blocked ? t("btns.unblock") : t("btns.block")}
            </AsyncButton>
          </ActiveComponent>
        </Stack>
        <List disablePadding>
          <ListItem>
            <Typography width="125px">
              {t("user-profile-dialog.fields.mutual-group", {
                ns: "component",
              })}
            </Typography>
            <Typography />
          </ListItem>
          <ListItem>
            <Typography width="125px">
              {t("user-profile-dialog.fields.phone-number", {
                ns: "component",
              })}
            </Typography>
            <Typography>{user?.phone?.toString() || "*********"}</Typography>
          </ListItem>
          <ListItem>
            <Typography width="125px">
              {t("user-profile-dialog.fields.gender", {
                ns: "component",
              })}
            </Typography>
            <Typography>
              {user?.gender === Gender.Male ? t("gender.male", { ns: "common" }) : t("gender.female", { ns: "common" })}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography width="125px">
              {t("user-profile-dialog.fields.birthday", {
                ns: "component",
              })}
            </Typography>
            <Typography>{user?.birthday.toLocaleDateString(i18n.language)}</Typography>
          </ListItem>
        </List>
      </Stack>
      <AddFriendDialog friendId={userId} open={modal === "Add-Friend"} onClose={() => setModal(null)} />
      <SetAliasDialog open={modal === "Alias"} friendId={userId} onClose={() => setModal(null)} />
      <DeleteFriendConfirm friendId={userId} open={modal === "Delete"} onClose={() => setModal(null)} />
    </Modal>
  );
}
