import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AvatarGroup, Button, Stack, Typography } from "@mui/material";
import { AppDispatch, RootState } from "../store";
import useGroup from "../hooks/useGroup";
import { acceptGroupInvitation, joinGroup, sendGroupRequest } from "../thunks/groupThunk";
import ActiveComponent from "../components/ActiveComponent";
import AsyncButton from "../components/AsyncButton";
import Modal from "../components/Modal";
import MuiNavLink from "../components/MuiNavLink";
import GroupAvatar from "../components/avatar/GroupAvatar";
import UserAvatar from "../components/avatar/UserAvatar";
import LeaveGroupConfirm from "./LeaveGroupConfirm";

export default function GroupProfileDialog({
  open,
  groupId,
  onClose,
}: {
  open: boolean;
  groupId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector<RootState, string>((state) => state.auth.userId);
  const group = useGroup(groupId as string);

  const [modal, setModal] = useState<"Delete" | null>(null);

  return (
    <Modal
      open={Boolean(group) && open}
      title={t("group-profile-dialog.title", { ns: "components" })}
      onClose={onClose}
    >
      <Stack width="250px" alignItems="center" textAlign="center" gap={1}>
        {groupId && <GroupAvatar groupId={groupId} size={96} />}
        <Typography className="text-xl">{group?.name}</Typography>
        <Typography className=" text-sm" color="secondary">
          {t("group-profile-dialog.members", { ns: "components", count: group?.numberOfMembers })}
        </Typography>
        <AvatarGroup
          max={4}
          total={group?.members.length}
          componentsProps={{
            additionalAvatar: {
              sx: {
                width: "48px",
                height: "48px",
              },
            },
          }}
        >
          {group?.members.map((m) => <UserAvatar key={m.userId} userId={m.userId} size={48} />)}
        </AvatarGroup>
        <Stack direction="row" justifyContent="space-around" width="100%">
          <ActiveComponent condition={group?.members.some((m) => m.userId === userId)}>
            <Button
              variant="outlined"
              size="small"
              component={MuiNavLink}
              to={"/Group/" + groupId}
              onClick={() => onClose()}
            >
              {t("btns.chat")}
            </Button>
          </ActiveComponent>
          <ActiveComponent condition={group?.members.some((m) => m.userId === userId)}>
            <AsyncButton variant="outlined" color="error" size="small" onClick={() => setModal("Delete")}>
              {t("btns.leave-group")}
            </AsyncButton>
          </ActiveComponent>
          <ActiveComponent condition={group?.joinRequests.some((r) => r.userId === userId)}>
            <AsyncButton variant="outlined" size="small" color="error" onClick={() => setModal("Delete")}>
              {t("btns.undo")}
            </AsyncButton>
          </ActiveComponent>
          <ActiveComponent condition={group?.joinInvitations.some((r) => r.userId === userId)}>
            <AsyncButton
              variant="outlined"
              size="small"
              onClick={async () => groupId && (await dispatch(acceptGroupInvitation(groupId)))}
            >
              {t("btns.accept")}
            </AsyncButton>
            <AsyncButton variant="outlined" size="small" color="error" onClick={() => setModal("Delete")}>
              {t("btns.reject-group-invitation")}
            </AsyncButton>
          </ActiveComponent>
          <ActiveComponent
            condition={
              !group?.members.some((m) => m.userId === userId) &&
              !group?.joinRequests.some((r) => r.userId === userId) &&
              !group?.joinInvitations.some((r) => r.userId === userId)
            }
          >
            <ActiveComponent condition={group?.setting.joinGroupByLink}>
              <ActiveComponent condition={!group?.setting.membershipApproval}>
                <AsyncButton
                  variant="outlined"
                  size="small"
                  onClick={async () => groupId && (await dispatch(joinGroup(groupId)))}
                >
                  {t("btns.join-group")}
                </AsyncButton>
              </ActiveComponent>
              <ActiveComponent condition={group?.setting.membershipApproval}>
                <AsyncButton
                  variant="outlined"
                  size="small"
                  onClick={async () => groupId && (await dispatch(sendGroupRequest(groupId)))}
                >
                  {t("btns.send-group-request")}
                </AsyncButton>
              </ActiveComponent>
            </ActiveComponent>
          </ActiveComponent>
        </Stack>
      </Stack>
      <LeaveGroupConfirm open={modal === "Delete"} groupId={groupId} onClose={() => setModal(null)} />
    </Modal>
  );
}
