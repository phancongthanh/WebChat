import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import Group, { JoinRequest } from "../../types/Group";
import GroupUtils from "../../utils/group-utils";
import { AppDispatch } from "../../store";
import useGlobalElement from "../../hooks/useGlobalElement";
import useUser from "../../hooks/useUser";
import { acceptGroupRequest, rejectGroupRequest } from "../../thunks/groupThunk";
import ActiveComponent from "../../components/ActiveComponent";
import AsyncButton from "../../components/AsyncButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import UserAvatar from "../../components/avatar/UserAvatar";

function RequestOption({ request, isAdmin }: { request: JoinRequest; isAdmin?: boolean }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useUser(request.userId);
  const { showUserProfile } = useGlobalElement();
  const [modal, setModal] = useState<"Reject" | null>(null);

  return (
    <>
      <ListItemButton className="hidden-action-container" disableRipple>
        <ListItemIcon>
          <UserAvatar userId={request.userId} size={40} onClick={() => showUserProfile(request.userId)} />
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap text-ellipsis overflow-hidden">
            {user?.alias || user?.name}
          </Typography>
        </ListItemText>
        <ActiveComponent condition={isAdmin}>
          <Stack className="hidden-action" direction="row" gap={1}>
            <AsyncButton size="small" color="error" onClick={() => setModal("Reject")}>
              {t("btns.reject")}
            </AsyncButton>
            <AsyncButton
              size="small"
              variant="contained"
              onClick={async () => await dispatch(acceptGroupRequest(request))}
            >
              {t("btns.accept")}
            </AsyncButton>
          </Stack>
        </ActiveComponent>
      </ListItemButton>
      <ConfirmDialog
        open={modal === "Reject"}
        onConfirm={async () => await dispatch(rejectGroupRequest(request))}
        onClose={() => setModal(null)}
      >
        {t("group-chat.info.reject-confirm", { ns: "pages", name: user?.alias || user?.name })}
      </ConfirmDialog>
    </>
  );
}

export default function RequestManagement({ group }: { group: Group }) {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  const isAdmin = GroupUtils.isAdmin(GroupUtils.getMember(group)?.role);

  return (
    <>
      <ListItem onClick={() => setHidden(!hidden)}>
        <ListItemText className="cursor-pointer">
          <Typography className="text-base font-medium text-black">
            {t("group-chat.info.header.group-requests", { ns: "pages" })}
          </Typography>
        </ListItemText>
        <FontAwesomeIcon icon={hidden ? "angle-right" : "angle-down"} />
      </ListItem>
      <Collapse in={!hidden} timeout="auto">
        <List>{group?.joinRequests.map((r) => <RequestOption key={r.userId} request={r} isAdmin={isAdmin} />)}</List>
      </Collapse>
    </>
  );
}
