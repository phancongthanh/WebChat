import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Stack } from "@mui/material";
import { ViewType } from "../enums/ViewType";
import SquareIcon from "../components/SquareIcon";

export default function Header({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <Stack component="header" className="box-border px-4 h-16 min-h-16" direction="row" alignItems="center" gap={1}>
      <IconButton
        sx={{
          display: { xs: "inline-flex", md: "none" },
        }}
        onClick={() => navigate(ViewType.StartBox)}
      >
        <SquareIcon>
          <FontAwesomeIcon icon="chevron-left" size="xs" />
        </SquareIcon>
      </IconButton>
      {children}
    </Stack>
  );
}
