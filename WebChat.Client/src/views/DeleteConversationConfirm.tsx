import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { deleteConversation } from "../thunks/conversationThunk";
import ConfirmDialog from "../components/ConfirmDialog";

export default function DeleteConversationConfirm({
  conversationId,
  open,
  onClose,
}: {
  open: boolean;
  conversationId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    if (!conversationId) return;
    await dispatch(deleteConversation(conversationId));
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      okText={t("delete-conversation-confirm.delete", { ns: "views" })}
      onConfirm={handleDelete}
      onClose={onClose}
    >
      {t("delete-conversation-confirm.content", { ns: "views" })}
    </ConfirmDialog>
  );
}
