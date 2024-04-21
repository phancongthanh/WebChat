import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import useUser from "../hooks/useUser";
import { cancelFriendRequest } from "../thunks/friendThunk";
import ActiveComponent from "../components/ActiveComponent";
import ConfirmDialog from "../components/ConfirmDialog";

export default function DeleteFriendConfirm({
  friendId,
  open,
  onClose,
}: {
  open: boolean;
  friendId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const friend = useUser(friendId as string);

  const name = friend?.alias || friend?.name;

  const handleDelete = async () => {
    if (!friendId) return;
    await dispatch(cancelFriendRequest(friendId));
    onClose();
  };

  return (
    <ConfirmDialog open={Boolean(friend) && open} onConfirm={handleDelete} onClose={onClose}>
      <ActiveComponent condition={friend?.isFriend}>
        {t("delete-friend-confirm.delete", { ns: "views", name })}
      </ActiveComponent>
      <ActiveComponent condition={friend?.requestOfUser}>
        {t("delete-friend-confirm.undo", { ns: "views", name })}
      </ActiveComponent>
      <ActiveComponent condition={friend?.requestOfFriend}>
        {t("delete-friend-confirm.reject", { ns: "views", name })}
      </ActiveComponent>
    </ConfirmDialog>
  );
}
