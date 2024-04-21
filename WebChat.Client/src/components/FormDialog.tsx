import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LoadingButtonProps } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, SxProps } from "@mui/material";
import ActiveComponent from "./ActiveComponent";
import AsyncButton from "./AsyncButton";
import CancelButton from "./CancelButton";
import StyledDialogTitle from "./StyledDialogTitle";

const style: SxProps = {
  "& .MuiFormLabel-root": {
    color: "inherit",
  },
};

export default function FormDialog({
  open,
  onClose,
  title,
  onSubmit,
  onReset,
  children,
  okText,
  isSubmitting,
  isValid,
  okBtnProps,
  cancelText,
  cancelBtnProps,
  btns,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  okText?: string;
  isSubmitting?: boolean;
  isValid?: boolean;
  okBtnProps?: LoadingButtonProps;
  cancelText?: string;
  cancelBtnProps?: LoadingButtonProps;
  btns?: ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
  onReset?: (e: unknown) => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      sx={style}
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: onSubmit,
        onReset: onReset,
      }}
    >
      <StyledDialogTitle onClose={onClose}>{title}</StyledDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {btns}
        <ActiveComponent condition={!btns}>
          <CancelButton onClick={onClose} {...cancelBtnProps}>
            {cancelText}
          </CancelButton>
          <AsyncButton
            type="submit"
            variant="contained"
            disableRipple
            disabled={!isValid}
            loading={isSubmitting}
            {...okBtnProps}
          >
            {okText || t("btns.send")}
          </AsyncButton>
        </ActiveComponent>
      </DialogActions>
    </Dialog>
  );
}
