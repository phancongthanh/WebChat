import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import Group, { JoinInvitation } from "../../types/Group";
import { AppDispatch, RootState } from "../../store";
import useAuth from "../../hooks/useAuth";
import useGroup from "../../hooks/useGroup";
import { acceptGroupInvitation } from "../../thunks/groupThunk";
import ActiveComponent from "../../components/ActiveComponent";
import AsyncButton from "../../components/AsyncButton";
import GroupAvatar from "../../components/avatar/GroupAvatar";
import GroupProfileDialog from "../../views/GroupProfileDialog";
import LeaveGroupConfirm from "../../views/LeaveGroupConfirm";

function InvitationOption({
  invitation,
  openProfile,
  onAccept,
  onReject,
}: {
  invitation: JoinInvitation;
  openProfile: () => void;
  onAccept: () => Promise<unknown> | void;
  onReject: () => void;
}) {
  const { t } = useTranslation();
  const group = useGroup(invitation.groupId);

  return (
    <Card variant="outlined" className="min-w-44 w-44 flex flex-col">
      <CardContent className="flex flex-col flex-1 justify-center items-center gap-2 text-center">
        <GroupAvatar groupId={invitation.groupId} size={48} onClick={openProfile} />
        <Typography className=" text-base">{group?.name}</Typography>
      </CardContent>
      <CardActions className="flex flex-row justify-center items-center p-4 pt-0">
        <AsyncButton variant="contained" size="small" onClick={onAccept}>
          {t("btns.accept")}
        </AsyncButton>
        <Button variant="outlined" size="small" color="error" onClick={onReject}>
          {t("btns.reject")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default function InvitationList() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useAuth().userId;
  const groups = useSelector<RootState, object>((state) => state.groups);
  const [rejectGroupId, setGroupId] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<string | undefined>(undefined);

  const invitations = useMemo(
    () =>
      Object.values(groups)
        .map((g: Group | null | undefined) => g?.joinInvitations?.find((r) => r.userId === currentUserId))
        .filter((invitation) => invitation),
    [groups, currentUserId],
  ) as JoinInvitation[];

  return (
    <ActiveComponent condition={invitations.length}>
      <Stack className="requests-list" padding="0 10%" gap={2} margin="16px 0">
        <Typography fontWeight="bold">
          {t("group-requests.received-invitations", {
            ns: "pages",
            count: invitations.length,
          })}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {invitations.map((invitation) => (
            <InvitationOption
              key={invitation?.groupId}
              invitation={invitation}
              openProfile={() => setProfile(invitation.groupId)}
              onAccept={async () => await dispatch(acceptGroupInvitation(invitation.groupId))}
              onReject={() => setGroupId(invitation.groupId)}
            />
          ))}
        </Stack>
      </Stack>
      <GroupProfileDialog open={profile !== undefined} groupId={profile} onClose={() => setProfile(undefined)} />
      <LeaveGroupConfirm
        open={rejectGroupId !== undefined}
        groupId={rejectGroupId}
        onClose={() => setGroupId(undefined)}
      />
    </ActiveComponent>
  );
}
