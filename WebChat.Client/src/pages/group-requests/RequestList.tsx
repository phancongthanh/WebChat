import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import Group, { JoinRequest } from "../../types/Group";
import { RootState } from "../../store";
import useAuth from "../../hooks/useAuth";
import useGroup from "../../hooks/useGroup";
import ActiveComponent from "../../components/ActiveComponent";
import GroupAvatar from "../../components/avatar/GroupAvatar";
import GroupProfileDialog from "../../views/GroupProfileDialog";
import LeaveGroupConfirm from "../../views/LeaveGroupConfirm";

function RequestOption({
  request,
  openProfile,
  onUndo,
}: {
  request: JoinRequest;
  openProfile: () => void;
  onUndo: () => void;
}) {
  const { t } = useTranslation();
  const group = useGroup(request.groupId);

  return (
    <Card variant="outlined" className="min-w-44 w-44 flex flex-col">
      <CardContent className="flex flex-col flex-1 justify-center items-center gap-2 text-center">
        <GroupAvatar groupId={request.groupId} size={48} onClick={openProfile} />
        <Typography className=" text-base">{group?.name}</Typography>
      </CardContent>
      <CardActions className="flex flex-row justify-center items-center p-4 pt-0">
        <Button variant="outlined" size="small" color="error" onClick={onUndo}>
          {t("btns.undo")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default function SentRequestsList() {
  const { t } = useTranslation();
  const currentUserId = useAuth().userId;
  const groups = useSelector<RootState, object>((state) => state.groups);
  const [undoGroupId, setGroupId] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<string | undefined>(undefined);

  const requests = useMemo(
    () =>
      Object.values(groups)
        .map((g: Group | null | undefined) => g?.joinRequests?.find((r) => r.userId === currentUserId))
        .filter((request) => request),
    [groups, currentUserId],
  ) as JoinRequest[];

  return (
    <ActiveComponent condition={requests.length}>
      <Stack className="requests-list" padding="0 10%" gap={2} margin="16px 0">
        <Typography fontWeight="bold">
          {t("group-requests.sent-requests", {
            ns: "pages",
            count: requests.length,
          })}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {requests.map((request) => (
            <RequestOption
              key={request.groupId}
              request={request}
              openProfile={() => setProfile(request.groupId)}
              onUndo={() => setGroupId(request.groupId)}
            />
          ))}
        </Stack>
      </Stack>
      <GroupProfileDialog open={profile !== undefined} groupId={profile} onClose={() => setProfile(undefined)} />
      <LeaveGroupConfirm open={undoGroupId !== undefined} groupId={undoGroupId} onClose={() => setGroupId(undefined)} />
    </ActiveComponent>
  );
}
