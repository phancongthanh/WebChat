import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { GlobalElementContext } from "../layouts/GlobalElement";
import Modal, { ModalProps } from "../components/Modal";
import GroupProfileDialog from "../views/GroupProfileDialog";
import SetAliasDialog from "../views/SetAliasDialog";
import UpdateGroupNameDialog from "../views/UpdateGroupNameDialog";
import UpdateInfoDialog from "../views/UpdateInfoDialog";
import UserProfileDialog from "../views/UserProfileDialog";

export default function useGlobalElement() {
  const currentUserId = useSelector<RootState, string>((state) => state.auth.userId);
  const { showElement, hideElement, hideAllElement } = useContext(GlobalElementContext);

  const showAlert = (props: ModalProps) => {
    const el = <Modal key="Alert" {...props} />;
    showElement("Alert", el);
    return () => hideElement("Alert");
  };

  const showUserProfile = (userId?: string, onClose?: () => void) => {
    const handleClose = () => {
      if (onClose) onClose();
      hideElement("UserProfile");
    };
    if (userId && userId !== currentUserId) {
      const el = <UserProfileDialog key="UserProfile" open={true} userId={userId} onClose={handleClose} />;
      showElement("UserProfile", el);
    } else {
      const el = <UpdateInfoDialog key="UserProfile" open={true} onClose={handleClose} />;
      showElement("UserProfile", el);
    }
  };
  const showGroupProfile = (groupId: string, onClose?: () => void) => {
    const handleClose = () => {
      if (onClose) onClose();
      hideElement("GroupProfile");
    };
    const el = <GroupProfileDialog key="GroupProfile" open={true} groupId={groupId} onClose={handleClose} />;
    showElement("GroupProfile", el);
  };
  const openSetAlias = (friendId?: string, onClose?: () => void) => {
    const handleClose = () => {
      if (onClose) onClose();
      hideElement("SetAlias");
    };
    if (friendId && friendId !== currentUserId) {
      const el = <SetAliasDialog key="SetAlias" open={true} friendId={friendId} onClose={handleClose} />;
      showElement("SetAlias", el);
    }
  };
  const updateGroupName = (groupId?: string, onClose?: () => void) => {
    const handleClose = () => {
      if (onClose) onClose();
      hideElement("UpdateGroupName");
    };
    if (groupId && groupId !== currentUserId) {
      const el = <UpdateGroupNameDialog key="UpdateGroupName" open={true} groupId={groupId} onClose={handleClose} />;
      showElement("UpdateGroupName", el);
    }
  };

  return {
    showElement,
    hideElement,
    hideAllElement,
    showAlert,
    showUserProfile,
    showGroupProfile,
    openSetAlias,
    updateGroupName,
  };
}
