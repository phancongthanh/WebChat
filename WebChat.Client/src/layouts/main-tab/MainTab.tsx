import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TabType } from "../../enums/TabType";
import { storage } from "../../utils/storage-management";
import UserAvatar from "../../components/avatar/UserAvatar";
import SettingMenu from "./SettingMenu";

export default function MainTab({ tab, changeTab }: { tab: TabType; changeTab: (tab: TabType) => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [settingMenu, setOpen] = useState(false);

  return (
    <Stack
      className="h-full w-16 min-w-16 m-0 overflow-auto disable-scroll-bar"
      sx={{
        backgroundColor: "primary.main",
        "& .Mui-selected": {
          color: "white !important",
        },
      }}
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      spacing={2}
    >
      <ToggleButtonGroup orientation="vertical" exclusive value={tab} onChange={(_, value) => changeTab(value)}>
        <Stack className="min-h-24" alignItems="center" justifyContent="center">
          <UserAvatar userId={storage.getUserId() || ""} size={48} />
        </Stack>
        <ToggleButton
          className="text-white w-16 h-16 border-none"
          title={t("main-tab.btn-title.message", { ns: "layout" })}
          value={TabType.Conversations}
        >
          <FontAwesomeIcon icon="comment" size="2xl" />
        </ToggleButton>
        <ToggleButton
          className="text-white w-16 h-16 border-none"
          title={t("main-tab.btn-title.friend", { ns: "layout" })}
          value={TabType.Friends}
        >
          <FontAwesomeIcon icon="user-group" size="2xl" />
        </ToggleButton>
        <ToggleButton
          className="text-white w-16 h-16 border-none"
          title={t("main-tab.btn-title.group", { ns: "layout" })}
          value={TabType.Groups}
        >
          <FontAwesomeIcon icon="users" size="2xl" />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup orientation="vertical">
        <ToggleButton
          className="text-white w-16 h-16 border-none"
          title={t("main-tab.btn-title.cloud", { ns: "layout" })}
          value=""
          onClick={() => navigate("Cloud")}
        >
          <FontAwesomeIcon icon="cloud" size="2xl" />
        </ToggleButton>
        <ToggleButton
          className="text-white w-16 h-16 border-none"
          title={t("main-tab.btn-title.setting", { ns: "layout" })}
          value=""
          selected={settingMenu}
          onClick={() => setOpen(true)}
        >
          <FontAwesomeIcon icon="gear" size="2xl" />
        </ToggleButton>
        <SettingMenu open={settingMenu} onClose={() => setOpen(false)} />
      </ToggleButtonGroup>
    </Stack>
  );
}
