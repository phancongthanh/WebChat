import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogTitle, IconButton } from "@mui/material";
import ActiveComponent from "./ActiveComponent";
import SquareIcon from "./SquareIcon";

export default function StyledDialogTitle({ children, onClose }: { children?: ReactNode; onClose?: () => void }) {
  return (
    <DialogTitle position="relative" padding="10px 24px !important">
      {children}
      <ActiveComponent condition={Boolean(onClose)}>
        <IconButton className="absolute right-2 top-1/2 -translate-y-1/2" onClick={onClose}>
          <SquareIcon>
            <FontAwesomeIcon icon="xmark" />
          </SquareIcon>
        </IconButton>
      </ActiveComponent>
    </DialogTitle>
  );
}
