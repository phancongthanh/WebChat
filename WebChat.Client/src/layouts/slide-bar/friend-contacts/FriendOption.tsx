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
import User from "../../../types/User";
import useGlobalElement from "../../../hooks/useGlobalElement";
import MuiNavLink from "../../../components/MuiNavLink";
import SquareIcon from "../../../components/SquareIcon";
import UserAvatar from "../../../components/avatar/UserAvatar";
import DeleteFriendConfirm from "../../../views/DeleteFriendConfirm";

function FriendMenu({ friend }: { friend: User }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { showUserProfile, openSetAlias } = useGlobalElement();
  const [deleteConfirm, setDelete] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMore = () => {
    showUserProfile(friend.userId);
    setAnchorEl(null);
  };
  const handleAlias = () => {
    openSetAlias(friend.userId);
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setDelete(true);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton className="hidden-action" edge="end" onClick={handleOpen}>
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
        <MenuItem onClick={handleMore}>{t("friend-contacts.menu.more", { ns: "layouts" })}</MenuItem>
        <MenuItem onClick={handleAlias}>{t("friend-contacts.menu.alias", { ns: "layouts" })}</MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          {t("friend-contacts.menu.delete", { ns: "layouts" })}
        </MenuItem>
      </Menu>
      <DeleteFriendConfirm friendId={friend.userId} open={deleteConfirm} onClose={() => setDelete(false)} />
    </Box>
  );
}

export default function FriendOption({ friend }: { friend: User }) {
  return (
    <ListItem disablePadding className="hidden-action-container" secondaryAction={<FriendMenu friend={friend} />}>
      <ListItemButton component={MuiNavLink} to={"/User/" + friend.userId}>
        <ListItemIcon>
          <UserAvatar userId={friend.userId} size={40} />
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">
            {friend.alias || friend.name}
          </Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
