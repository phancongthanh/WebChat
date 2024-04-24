import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoadingButtonProps } from "@mui/lab";
import { ButtonProps, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import AsyncButton from "./AsyncButton";
import CancelButton from "./CancelButton";
import StyledDialogTitle from "./StyledDialogTitle";

export default function ConfirmDialog({
  open,
  title,
  children,
  okText,
  okBtnProps,
  cancelText,
  cancelBtnProps,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  children: ReactNode;
  okText?: string;
  okBtnProps?: LoadingButtonProps;
  cancelText?: string;
  cancelBtnProps?: ButtonProps;
  onClose?: () => void;
  onConfirm?: () => void | Promise<unknown>;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle onClose={onClose}>
        <Typography className=" inline-block mr-2 text-xl" color="warning.main">
          <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
        </Typography>
        {title || t("confirm-dialog.title", { ns: "components" })}
      </StyledDialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <CancelButton onClick={onClose} {...cancelBtnProps}>
          {cancelText}
        </CancelButton>
        <AsyncButton variant="contained" color="error" onClick={onConfirm} disableRipple {...okBtnProps}>
          {okText || t("btns.confirm")}
        </AsyncButton>
      </DialogActions>
    </Dialog>
  );
}
