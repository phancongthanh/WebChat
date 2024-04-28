import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Box, List, ListItem, Modal, Paper, SxProps, Typography } from "@mui/material";
import { SystemInfo } from "../../types/SystemInfo";
import { RootState } from "../../store";

const style: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "90%",
  bgcolor: "background.paper",
  overflow: "hidden",
  "& .MuiList-root .MuiTypography-root:first-child": {
    fontWeight: "bold",
    flex: "0 0 130px",
  },
  "& .MuiList-root .MuiTypography-root": {
    flex: 1,
    wordWrap: "break-word",
  },
};

export default function AppInfo({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const systemInfo = useSelector<RootState, SystemInfo>((state) => state.system);
  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={style}>
        <Box bgcolor="blue" padding="16px" color="white">
          <Typography variant="h4">{t("app-info.title", { ns: "layouts" })}</Typography>
          <a className="text-white no-underline" href="https://zalo.me/zalo-chat">
            <Typography>{t("app-info.description", { ns: "layouts" })}</Typography>
          </a>
        </Box>
        <List>
          <ListItem>
            <Typography>{t("app-info.fields.app-name", { ns: "layouts" })}</Typography>
            <Typography>{systemInfo.appName}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{t("app-info.fields.version", { ns: "layouts" })}</Typography>
            <Typography>{systemInfo.version}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{t("app-info.fields.phone", { ns: "layouts" })}</Typography>
            <Typography>{systemInfo.adminPhone.toString()}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{t("app-info.fields.email", { ns: "layouts" })}</Typography>
            <Typography>{systemInfo.email}</Typography>
          </ListItem>
          <ListItem>
            <Typography>{t("app-info.fields.group-code", { ns: "layouts" })}</Typography>
            <Typography>{systemInfo.globalGroupCode}</Typography>
          </ListItem>
        </List>
      </Paper>
    </Modal>
  );
}
