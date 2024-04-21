import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { MemberRole } from "../../enums/MemberRole";
import Group from "../../types/Group";
import GroupUtils from "../../utils/group-utils";
import LeaveGroupConfirm from "../../views/LeaveGroupConfirm";

export default function ActionManagement({ group }: { group: Group }) {
  const { t } = useTranslation();
  const [modal, setModal] = useState<"Leave" | null>(null);

  return (
    <>
      <ListItemButton
        sx={{ color: "error.main" }}
        onClick={() => setModal("Leave")}
        disabled={GroupUtils.getMember(group)?.role === MemberRole.Leader}
      >
        <ListItemIcon className="text-inherit pr-4 box-border justify-center">
          <FontAwesomeIcon className=" text-xl" icon="arrow-right-from-bracket" />
        </ListItemIcon>
        <ListItemText>{t("btns.leave-group")}</ListItemText>
      </ListItemButton>
      <LeaveGroupConfirm open={modal === "Leave"} groupId={group.groupId} onClose={() => setModal(null)} />
    </>
  );
}
