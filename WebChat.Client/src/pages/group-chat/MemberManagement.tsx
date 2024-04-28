import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { MemberRole } from "../../enums/MemberRole";
import Group, { GroupMember } from "../../types/Group";
import GroupUtils from "../../utils/group-utils";
import { AppDispatch } from "../../store";
import useGlobalElement from "../../hooks/useGlobalElement";
import useGroup from "../../hooks/useGroup";
import useUser from "../../hooks/useUser";
import { kickGroupMember, updateMemberRole } from "../../thunks/groupThunk";
import ActiveComponent from "../../components/ActiveComponent";
import ConfirmDialog from "../../components/ConfirmDialog";
import SquareIcon from "../../components/SquareIcon";
import UserAvatar from "../../components/avatar/UserAvatar";

function MemberMenu({ member }: { member: GroupMember }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const group = useGroup(member.groupId);
  const user = useUser(member.userId);
  const currentMember = group && GroupUtils.getMember(group);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [modal, setModal] = useState<"Member" | "DG" | "Leader" | "Block" | "Unblock" | "Delete" | null>(null);
  useEffect(() => {
    modal !== null && setAnchorEl(null);
  }, [modal]);
  const handle = async () => {
    let role = member.role;
    switch (modal) {
      case "Delete":
        await dispatch(kickGroupMember(member));
        setModal(null);
        return;
      case "Leader":
        role = MemberRole.Leader;
        break;
      case "DG":
        role = MemberRole.DeputyGroup;
        break;
      case "Block":
        role = MemberRole.IsBlock;
        break;
      default:
        role = MemberRole.Member;
    }
    await dispatch(updateMemberRole({ ...member, role }));
    setModal(null);
  };

  return (
    <ActiveComponent
      condition={currentMember && GroupUtils.isAdmin(currentMember.role) && currentMember.role > member.role}
    >
      <IconButton className="hidden-action" edge="end" onClick={handleOpen}>
        <SquareIcon>
          <FontAwesomeIcon icon="ellipsis" />
        </SquareIcon>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <ActiveComponent condition={currentMember?.role === MemberRole.Leader && member.role !== MemberRole.IsBlock}>
          <ActiveComponent condition={member.role !== MemberRole.Member}>
            <MenuItem onClick={() => setModal("Member")}>
              {t("group-chat.info.role-actions.member", { ns: "pages" })}
            </MenuItem>
          </ActiveComponent>
          <ActiveComponent condition={member.role !== MemberRole.DeputyGroup}>
            <MenuItem onClick={() => setModal("DG")}>
              {t("group-chat.info.role-actions.deputy-group", { ns: "pages" })}
            </MenuItem>
          </ActiveComponent>
          <ActiveComponent condition={member.role !== MemberRole.Leader}>
            <MenuItem onClick={() => setModal("Leader")}>
              {t("group-chat.info.role-actions.leader", { ns: "pages" })}
            </MenuItem>
          </ActiveComponent>
          <Divider />
        </ActiveComponent>
        <ActiveComponent condition={member.role === MemberRole.IsBlock}>
          <MenuItem onClick={() => setModal("Unblock")}>{t("btns.unblock")}</MenuItem>
          <Divider />
        </ActiveComponent>
        <ActiveComponent condition={member.role !== MemberRole.IsBlock}>
          <MenuItem sx={{ color: "error.main" }} onClick={() => setModal("Block")}>
            {t("btns.block")}
          </MenuItem>
        </ActiveComponent>
        <MenuItem sx={{ color: "error.main" }} onClick={() => setModal("Delete")}>
          {t("btns.kick-member")}
        </MenuItem>
      </Menu>
      <ConfirmDialog open={modal !== null} onConfirm={handle} onClose={() => setModal(null)}>
        <ActiveComponent condition={modal === "Block"}>
          {t("group-chat.info.confirms.block", { ns: "pages", name: user?.alias || user?.name })}
        </ActiveComponent>
        <ActiveComponent condition={modal === "Unblock"}>
          {t("group-chat.info.confirms.unblock", { ns: "pages", name: user?.alias || user?.name })}
        </ActiveComponent>
        <ActiveComponent condition={modal === "Delete"}>
          {t("group-chat.info.confirms.kick-member", { ns: "pages", name: user?.alias || user?.name })}
        </ActiveComponent>
        <ActiveComponent condition={modal === "Leader"}>
          {t("group-chat.info.confirms.leader", { ns: "pages", name: user?.alias || user?.name })}
        </ActiveComponent>
        <ActiveComponent condition={modal === "DG"}>
          {t("group-chat.info.confirms.deputy-group", { ns: "pages", name: user?.alias || user?.name })}
        </ActiveComponent>
        <ActiveComponent condition={modal === "Member"}>
          {t("group-chat.info.confirms.member", { ns: "pages", name: user?.alias || user?.name })}
        </ActiveComponent>
      </ConfirmDialog>
    </ActiveComponent>
  );
}

function MemberOption({ member }: { member: GroupMember }) {
  const { t } = useTranslation();
  const user = useUser(member.userId);
  const joinBy = useUser(member.joinBy as string);
  const { showUserProfile } = useGlobalElement();

  return (
    <ListItem disablePadding className="hidden-action-container" secondaryAction={<MemberMenu member={member} />}>
      <ListItemButton disableRipple>
        <ListItemIcon>
          <UserAvatar userId={member.userId} size={40} onClick={() => showUserProfile(member.userId)} />
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap text-ellipsis overflow-hidden">
            {user?.alias || user?.name}
          </Typography>
          <Typography className="whitespace-nowrap text-ellipsis overflow-hidden text-sm" color="secondary">
            <ActiveComponent condition={member.role === MemberRole.Leader}>{t("member-role.leader")}</ActiveComponent>
            <ActiveComponent condition={member.role === MemberRole.DeputyGroup}>
              {t("member-role.deputy-group")}
            </ActiveComponent>
            <ActiveComponent condition={member.role === MemberRole.IsBlock}>
              {t("member-role.is-block")}
            </ActiveComponent>
            <ActiveComponent condition={member.role === MemberRole.Member && !joinBy}>
              {t("member-role.member")}
            </ActiveComponent>
            <ActiveComponent condition={member.role === MemberRole.Member && joinBy}>
              {t("group-chat.info.join-by", { ns: "pages", name: joinBy?.alias || joinBy?.name })}
            </ActiveComponent>
          </Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

export default function MemberManagement({ group }: { group: Group }) {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  return (
    <>
      <ListItem onClick={() => setHidden(!hidden)}>
        <ListItemText className="cursor-pointer">
          <Typography className="text-base font-medium text-black">
            {t("group-chat.info.header.member-list", { ns: "pages" })}
          </Typography>
        </ListItemText>
        <FontAwesomeIcon icon={hidden ? "angle-right" : "angle-down"} />
      </ListItem>
      <Collapse in={!hidden} timeout="auto">
        <List>{group?.members.map((m) => <MemberOption key={m.userId} member={m} />)}</List>
      </Collapse>
    </>
  );
}
