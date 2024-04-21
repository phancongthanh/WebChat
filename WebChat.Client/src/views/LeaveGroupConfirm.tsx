import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import useAuth from "../hooks/useAuth";
import useGroup from "../hooks/useGroup";
import { leaveGroup, rejectGroupInvitation, undoGroupRequest } from "../thunks/groupThunk";
import ActiveComponent from "../components/ActiveComponent";
import ConfirmDialog from "../components/ConfirmDialog";

export default function LeaveGroupConfirm({
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
  const { userId } = useAuth();
  const group = useGroup(groupId as string);

  const handleDelete = async () => {
    if (!groupId) return;
    if (group?.members.some((m) => m.userId === userId)) await dispatch(leaveGroup(groupId));
    if (group?.joinRequests.some((m) => m.userId === userId)) await dispatch(undoGroupRequest(groupId));
    if (group?.joinInvitations.some((m) => m.userId === userId)) await dispatch(rejectGroupInvitation(groupId));
    onClose();
  };

  return (
    <ConfirmDialog open={Boolean(group) && open} onConfirm={handleDelete} onClose={onClose}>
      <ActiveComponent condition={group?.members.some((m) => m.userId === userId)}>
        {t("leave-group-confirm.leave", { ns: "views", name: group?.name })}
      </ActiveComponent>
      <ActiveComponent condition={group?.joinRequests.some((m) => m.userId === userId)}>
        {t("leave-group-confirm.undo", { ns: "views", name: group?.name })}
      </ActiveComponent>
      <ActiveComponent condition={group?.joinInvitations.some((m) => m.userId === userId)}>
        {t("leave-group-confirm.reject", { ns: "views", name: group?.name })}
      </ActiveComponent>
    </ConfirmDialog>
  );
}
