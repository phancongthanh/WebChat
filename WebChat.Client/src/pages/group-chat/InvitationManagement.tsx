import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import Group, { JoinInvitation } from "../../types/Group";
import GroupUtils from "../../utils/group-utils";
import { AppDispatch } from "../../store";
import useAuth from "../../hooks/useAuth";
import useGlobalElement from "../../hooks/useGlobalElement";
import useUser from "../../hooks/useUser";
import { undoGroupInvitation } from "../../thunks/groupThunk";
import ActiveComponent from "../../components/ActiveComponent";
import AsyncButton from "../../components/AsyncButton";
import UserAvatar from "../../components/avatar/UserAvatar";

function InvitationOption({ request, isAdmin }: { request: JoinInvitation; isAdmin?: boolean }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useAuth().userId;
  const user = useUser(request.userId);
  const member = useUser(request.memberId);
  const { showUserProfile } = useGlobalElement();

  const handleUndo = async () => dispatch(undoGroupInvitation(request));

  return (
    <ListItemButton className="hidden-action-container" disableRipple>
      <ListItemIcon>
        <UserAvatar userId={request.userId} size={40} onClick={() => showUserProfile(request.userId)} />
      </ListItemIcon>
      <ListItemText>
        <Typography className="whitespace-nowrap text-ellipsis overflow-hidden">{user?.alias || user?.name}</Typography>
        <Typography className="whitespace-nowrap text-ellipsis overflow-hidden text-sm" color="secondary">
          {t("group-chat.info.send-by", { ns: "pages", name: member?.alias || member?.name })}
        </Typography>
      </ListItemText>
      <ActiveComponent condition={isAdmin || currentUserId === request.memberId}>
        <Stack className="hidden-action" direction="row">
          <AsyncButton size="small" color="error" onClick={handleUndo}>
            {t("btns.undo")}
          </AsyncButton>
        </Stack>
      </ActiveComponent>
    </ListItemButton>
  );
}

export default function InvitationManagement({ group }: { group: Group }) {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  const isAdmin = GroupUtils.isAdmin(GroupUtils.getMember(group)?.role);

  return (
    <>
      <ListItem onClick={() => setHidden(!hidden)}>
        <ListItemText className="cursor-pointer">
          <Typography className="text-base font-medium text-black">
            {t("group-chat.info.header.group-invitations", { ns: "pages" })}
          </Typography>
        </ListItemText>
        <FontAwesomeIcon icon={hidden ? "angle-right" : "angle-down"} />
      </ListItem>
      <Collapse in={!hidden} timeout="auto">
        <List>
          {group?.joinInvitations.map((r) => <InvitationOption key={r.userId} request={r} isAdmin={isAdmin} />)}
        </List>
      </Collapse>
    </>
  );
}
