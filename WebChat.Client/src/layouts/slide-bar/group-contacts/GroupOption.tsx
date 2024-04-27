import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Group from "../../../types/Group";
import GroupUtils from "../../../utils/group-utils";
import useGlobalElement from "../../../hooks/useGlobalElement";
import ActiveComponent from "../../../components/ActiveComponent";
import MuiNavLink from "../../../components/MuiNavLink";
import SquareIcon from "../../../components/SquareIcon";
import GroupAvatar from "../../../components/avatar/GroupAvatar";
import LeaveGroupConfirm from "../../../views/LeaveGroupConfirm";

function GroupMenu({ group }: { group: Group }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { updateGroupName, showGroupProfile } = useGlobalElement();
  const [leaveConfirm, setDialog] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMore = () => {
    showGroupProfile(group.groupId);
    setAnchorEl(null);
  };
  const handleChangeName = () => {
    updateGroupName(group.groupId);
    setAnchorEl(null);
  };
  const handleLeave = () => {
    setDialog(true);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton className="hidden-action" edge="end" aria-label="delete" onClick={handleOpen}>
        <SquareIcon>
          <FontAwesomeIcon icon="ellipsis" />
        </SquareIcon>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleMore}>{t("group-contacts.menu.more", { ns: "layouts" })}</MenuItem>
        <ActiveComponent
          condition={group.setting.allowChangeGName || GroupUtils.isAdmin(GroupUtils.getMember(group)?.role)}
        >
          <MenuItem onClick={handleChangeName}>{t("group-contacts.menu.name", { ns: "layouts" })}</MenuItem>
        </ActiveComponent>
        <Divider />
        <MenuItem onClick={handleLeave} sx={{ color: "error.main" }}>
          {t("group-contacts.menu.leave", { ns: "layouts" })}
        </MenuItem>
      </Menu>
      <LeaveGroupConfirm groupId={group.groupId} open={leaveConfirm} onClose={() => setDialog(false)} />
    </Box>
  );
}

export default function GroupOption({ group }: { group: Group }) {
  return (
    <ListItem disablePadding className="hidden-action-container" secondaryAction={<GroupMenu group={group} />}>
      <ListItemButton component={MuiNavLink} to={"/Group/" + group.groupId}>
        <ListItemIcon>
          <GroupAvatar groupId={group.groupId} size={40} />
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">{group.name}</Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
