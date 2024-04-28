import { ReactNode } from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import ActiveComponent from "./ActiveComponent";
import StyledDialogTitle from "./StyledDialogTitle";

export interface ModalProps {
  title: string;
  children?: ReactNode;
  btns?: ReactNode;
  open: boolean;
  onClose?: () => void;
}

export default function Modal({ title, children, btns, open, onClose }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle onClose={onClose}>{title}</StyledDialogTitle>
      <DialogContent className="disable-scroll-bar" dividers>
        {children}
      </DialogContent>
      <ActiveComponent condition={btns}>
        <DialogActions>{btns}</DialogActions>
      </ActiveComponent>
    </Dialog>
  );
}
