import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Collapse,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuList,
} from "@mui/material";
import cloudImg from "../../../assets/images/cloud-img.jpg";
import friendRequestsImg from "../../../assets/images/friend-requests-img.png";
import { ViewType } from "../../../enums/ViewType";
import useFriends from "../../../hooks/useFriends";
import MuiNavLink from "../../../components/MuiNavLink";
import SquareIcon from "../../../components/SquareIcon";
import FriendOption from "./FriendOption";
import FriendSearchDialog from "./FriendSearchDialog";

export default function FriendContacts() {
  const { t } = useTranslation();
  const friends = useFriends();

  const [hiddenFriend, setHiddenFriend] = useState(true);
  const [modal, setModal] = useState<"Search" | null>();

  return (
    <MenuList className=" overflow-auto disable-scroll-bar flex-1 relative">
      <ListItemButton onClick={() => setModal("Search")}>
        <ListItemIcon>
          <Avatar sx={{ color: "text.secondary", background: "transparent" }}>
            <SquareIcon size="1.25em">
              <FontAwesomeIcon icon="user-plus" />
            </SquareIcon>
          </Avatar>
        </ListItemIcon>
        <ListItemText>{t("friend-contacts.add-friend", { ns: "layout" })}</ListItemText>
      </ListItemButton>
      <FriendSearchDialog open={modal === "Search"} onClose={() => setModal(null)} />
      <ListItemButton component={MuiNavLink} to={ViewType.FriendRequests}>
        <ListItemIcon>
          <Avatar src={friendRequestsImg} />
        </ListItemIcon>
        <ListItemText>{t("friend-contacts.friend-requests", { ns: "layout" })}</ListItemText>
      </ListItemButton>
      <Divider variant="middle" />
      <ListSubheader component="div">{t("friend-contacts.cloud-description", { ns: "layout" })}</ListSubheader>
      <ListItemButton component={MuiNavLink} to="Cloud">
        <ListItemIcon>
          <Avatar src={cloudImg} />
        </ListItemIcon>
        <ListItemText>{t("friend-contacts.cloud", { ns: "layout" })}</ListItemText>
      </ListItemButton>
      <Divider variant="middle" />
      <ListItemButton onClick={() => setHiddenFriend(!hiddenFriend)}>
        <ListItemText>
          {t("friend-contacts.friend", {
            ns: "layout",
            count: friends.length,
          })}
        </ListItemText>
        <FontAwesomeIcon icon={hiddenFriend ? "angle-down" : "angle-up"} />
      </ListItemButton>
      <Collapse in={hiddenFriend} timeout="auto">
        <MenuList disablePadding>
          {friends.map((friend) => (
            <FriendOption key={friend.userId} friend={friend} />
          ))}
        </MenuList>
      </Collapse>
    </MenuList>
  );
}
