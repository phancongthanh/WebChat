import { ReactNode } from "react";
import { LoadingButtonProps } from "@mui/lab";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import AsyncButton from "./AsyncButton";
import StyledDialogTitle from "./StyledDialogTitle";

export default function Alert({
  open,
  title,
  children,
  btnText,
  btnClick,
  btnProps,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  btnText: string;
  btnClick: () => void | Promise<void>;
  btnProps?: LoadingButtonProps;
  onClose?: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle onClose={onClose}>{title}</StyledDialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <AsyncButton autoFocus variant="contained" onClick={btnClick} {...btnProps}>
          {btnText}
        </AsyncButton>
      </DialogActions>
    </Dialog>
  );
}
