import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import ApiError from "../../types/errors/ApiError";
import AppError from "../../types/errors/AppError";
import ClientError from "../../types/errors/ClientError";
import ConnectionError from "../../types/errors/ConnectionError";
import ServerError from "../../types/errors/ServerError";
import StyledDialogTitle from "../../components/StyledDialogTitle";

export default function ApiErrorAlert({ error, onClose }: { error?: ApiError; onClose?: (e: AppError) => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => setOpen(true), [error]);
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      const e = new AppError(title, description, details);
      onClose(e);
    }
  };
  let title = t("unknown.title", { ns: "error" });
  let description = t("unknown.description", { ns: "error" });
  let details = [] as string[];
  if (ConnectionError.isConnectionError(error)) {
    title = t("no-internet.title", { ns: "error" });
    description = t("no-internet.description", { ns: "error" });
  } else if (ServerError.isServerError(error)) {
    title = t("server.title", { ns: "error" });
    description = t("server.description", { ns: "error" });
  } else if (ClientError.isClientError(error)) {
    if (error.title) title = error.title;
    if (error.description) description = error.description;
    if (error.details) details = Object.values(error.details).flat();
  }
  return (
    <Dialog onClose={handleClose} open={open && !!error}>
      <StyledDialogTitle onClose={handleClose}>{title}</StyledDialogTitle>
      <DialogContent className="min-w-80">
        <Typography>{description}</Typography>
        {details.map((e) => (
          <Typography key={e}>{e}</Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
