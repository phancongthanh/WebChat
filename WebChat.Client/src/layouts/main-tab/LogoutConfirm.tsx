import { useTranslation } from "react-i18next";
import auth from "../../backend/auth";
import ConfirmDialog from "../../components/ConfirmDialog";

const logOut = async () => {
  await auth.logOut();
  window.location.reload();
};

export default function LogoutConfirm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog open={open} onClose={onClose} onConfirm={logOut}>
      {t("logout-confirm", { ns: "layout" })}
    </ConfirmDialog>
  );
}
