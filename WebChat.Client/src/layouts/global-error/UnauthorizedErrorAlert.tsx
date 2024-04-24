import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import StyledDialogTitle from "../../components/StyledDialogTitle";

export default function UnauthorizedErrorAlert({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const { t } = useTranslation();

  return (
    <Dialog onClose={onClose} open={open}>
      <StyledDialogTitle onClose={onClose}>{t("unauthorized.title", { ns: "error" })}</StyledDialogTitle>
      <DialogContent>
        <Typography>{t("unauthorized.description", { ns: "error" })}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => window.location.reload()}>
          {t("btns.reload")}
        </Button>
        <Button onClick={onClose}>{t("btns.close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
