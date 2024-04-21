import { useTranslation } from "react-i18next";
import { Box, List, ListItem, Modal, Paper, SxProps, Typography } from "@mui/material";

const style: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  overflow: "hidden",
  "& .MuiList-root .MuiTypography-root:first-child": {
    fontWeight: "bold",
    width: "125px",
  },
};

export default function AppInfo({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={style}>
        <Box bgcolor="blue" padding="16px" color="white">
          <Typography variant="h4">{t("app-info.title", { ns: "layout" })}</Typography>
        </Box>
        <List>
          <ListItem>
            <Typography>{t("app-info.fields.version", { ns: "layout" })}</Typography>
            <Typography>{t("app-info.values.version", { ns: "layout" })}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{t("app-info.fields.email", { ns: "layout" })}</Typography>
            <Typography>{t("app-info.values.email", { ns: "layout" })}</Typography>
          </ListItem>
        </List>
      </Paper>
    </Modal>
  );
}
