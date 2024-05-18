import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Tooltip, Typography } from "@mui/material";
import { Language } from "../../enums/Language";
import { storage } from "../../utils/storage-management";
import ActiveComponent from "../../components/ActiveComponent";
import UpdateInfoDialog from "../../views/UpdateInfoDialog";
import AppInfo from "./AppInfo";
import ChangePassword from "./ChangePassword";
import LogoutConfirm from "./LogoutConfirm";

export default function SettingMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { i18n, t } = useTranslation();
  const [modal, setModal] = useState<"AppInfo" | "Logout" | "UpdateProfile" | "ChangePassword" | null>(null);

  const changeLanguage = (language: Language) => {
    onClose();
    i18n.changeLanguage(language);
    storage.setLanguage(language);
  };

  useEffect(() => {
    modal !== null && onClose();
  }, [modal, onClose]);

  return (
    <>
      <Menu
        slotProps={{ paper: { className: "normal-scroll-bar" } }}
        anchorEl={document.body}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        onClose={onClose}
      >
        <MenuItem onClick={() => setModal("UpdateProfile")}>
          <ListItemIcon className="text-inherit">
            <FontAwesomeIcon icon="user" />
          </ListItemIcon>
          <ListItemText>{t("settings-menu.account-info", { ns: "layouts" })}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setModal("ChangePassword")}>
          <ListItemIcon className="text-inherit">
            <FontAwesomeIcon icon="key" />
          </ListItemIcon>
          <ListItemText>{t("settings-menu.change-password", { ns: "layouts" })}</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClose}>
          <ListItemIcon className="text-inherit">
            <FontAwesomeIcon icon="gear" />
          </ListItemIcon>
          <ListItemText>{t("settings-menu.settings", { ns: "layouts" })}</ListItemText>
        </MenuItem>
        <Divider />
        <Tooltip
          disableFocusListener
          enterTouchDelay={0}
          leaveDelay={50}
          placement="right"
          PopperProps={{
            className: "bg-white shadow-2xl rounded overflow-hidden",
          }}
          TransitionProps={{ style: { margin: 0, padding: 0 } }}
          title={
            <MenuList className="bg-white text-black">
              <MenuItem onClick={() => changeLanguage(Language.VI)}>
                <ListItemIcon className="text-inherit">
                  <ActiveComponent condition={i18n.language === Language.VI}>
                    <FontAwesomeIcon className="text-base" icon="check" />
                  </ActiveComponent>
                </ListItemIcon>
                <ListItemText>{t("settings-menu.vi", { ns: "layouts" })}</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => changeLanguage(Language.EN)}>
                <ListItemIcon className="text-inherit">
                  <ActiveComponent condition={i18n.language === Language.EN}>
                    <FontAwesomeIcon className="text-base" icon="check" />
                  </ActiveComponent>
                </ListItemIcon>
                <ListItemText>{t("settings-menu.en", { ns: "layouts" })}</ListItemText>
              </MenuItem>
            </MenuList>
          }
        >
          <MenuItem disableRipple>
            <ListItemIcon className="text-inherit">
              <FontAwesomeIcon icon="language" />
            </ListItemIcon>
            <ListItemText>{t("settings-menu.language", { ns: "layouts" })}</ListItemText>
            <Typography component="span" position="relative" noWrap overflow="visible">
              <FontAwesomeIcon icon="chevron-right" />
            </Typography>
          </MenuItem>
        </Tooltip>
        <Tooltip
          disableFocusListener
          enterTouchDelay={0}
          leaveDelay={50}
          placement="right"
          PopperProps={{
            className: "bg-white shadow-2xl rounded overflow-hidden",
          }}
          TransitionProps={{ style: { margin: 0, padding: 0 } }}
          title={
            <MenuList className="bg-white text-black">
              <MenuItem onClick={() => setModal("AppInfo")}>
                <ListItemText>{t("settings-menu.version", { ns: "layouts" })}</ListItemText>
              </MenuItem>
              <MenuItem onClick={onClose}>
                <ListItemText>{t("settings-menu.report", { ns: "layouts" })}</ListItemText>
              </MenuItem>
            </MenuList>
          }
        >
          <MenuItem disableRipple>
            <ListItemIcon className="text-inherit">
              <FontAwesomeIcon icon="circle-question" />
            </ListItemIcon>
            <ListItemText>{t("settings-menu.about", { ns: "layouts" })}</ListItemText>
            <Typography component="span" position="relative" noWrap color="inherit" overflow="visible">
              <FontAwesomeIcon icon="chevron-right" />
            </Typography>
          </MenuItem>
        </Tooltip>
        <Divider />
        <MenuItem onClick={() => setModal("Logout")} sx={{ color: "error.main" }}>
          <ListItemIcon className="text-inherit">
            <FontAwesomeIcon icon="arrow-right-from-bracket" />
          </ListItemIcon>
          <ListItemText>{t("settings-menu.logout", { ns: "layouts" })}</ListItemText>
        </MenuItem>
      </Menu>
      <UpdateInfoDialog open={modal === "UpdateProfile"} onClose={() => setModal(null)} />
      <ChangePassword open={modal === "ChangePassword"} onClose={() => setModal(null)} />
      <AppInfo open={modal === "AppInfo"} onClose={() => setModal(null)} />
      <LogoutConfirm open={modal === "Logout"} onClose={() => setModal(null)} />
    </>
  );
}
