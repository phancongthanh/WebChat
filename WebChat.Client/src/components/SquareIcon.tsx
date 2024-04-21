import { ReactNode } from "react";
import { Box, SxProps } from "@mui/material";

const style: SxProps = {
  aspectRatio: 1,
  minHeight: "min-content",
  minWidth: "min-content",
  margin: 0,
  padding: 0,
};

export default function SquareIcon({
  className,
  children,
  size,
}: {
  className?: string;
  children: ReactNode;
  size?: string | number;
}) {
  return (
    <Box
      className={"SquareIcon " + className}
      sx={style}
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      fontSize={size}
    >
      {children}
    </Box>
  );
}
