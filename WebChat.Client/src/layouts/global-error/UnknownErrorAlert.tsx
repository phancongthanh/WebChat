import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import StyledDialogTitle from "../../components/StyledDialogTitle";

export default function UnknownErrorAlert({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const { t } = useTranslation();

  return (
    <Dialog onClose={onClose} open={open}>
      <StyledDialogTitle onClose={onClose}>{t("unknown.title", { ns: "error" })}</StyledDialogTitle>
      <DialogContent>
        <Typography>{t("unknown.description", { ns: "error" })}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t("btns.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
