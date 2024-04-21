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
import joinedGroupsImg from "../../../assets/images/joined-groups-img.png";
import { ViewType } from "../../../enums/ViewType";
import useGroups from "../../../hooks/useGroups";
import MuiNavLink from "../../../components/MuiNavLink";
import SquareIcon from "../../../components/SquareIcon";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupOption from "./GroupOption";
import GroupSearchDialog from "./GroupSearchDialog";

export default function GroupContacts() {
  const { t } = useTranslation();
  const { groups } = useGroups();

  const [hiddenGroup, setHiddenGroup] = useState(true);
  const [modal, setModal] = useState<"Create" | "Search" | null>(null);

  return (
    <MenuList className="overflow-auto disable-scroll-bar flex-1 relative">
      <ListItemButton onClick={() => setModal("Create")}>
        <ListItemIcon>
          <Avatar sx={{ color: "text.secondary", background: "transparent" }}>
            <SquareIcon size="1.25em">
              <FontAwesomeIcon icon={["fas", "plus"]} />
            </SquareIcon>
          </Avatar>
        </ListItemIcon>
        <ListItemText>{t("group-contacts.create-group", { ns: "layout" })}</ListItemText>
      </ListItemButton>
      <CreateGroupDialog open={modal === "Create"} onClose={() => setModal(null)} />
      <ListItemButton onClick={() => setModal("Search")}>
        <ListItemIcon>
          <Avatar sx={{ color: "text.secondary", background: "transparent" }}>
            <SquareIcon size="1.25em">
              <FontAwesomeIcon icon={["fas", "magnifying-glass"]} />
            </SquareIcon>
          </Avatar>
        </ListItemIcon>
        <ListItemText>{t("group-contacts.search-group", { ns: "layout" })}</ListItemText>
      </ListItemButton>
      <GroupSearchDialog open={modal === "Search"} onClose={() => setModal(null)} />
      <Divider variant="middle" />
      <ListSubheader component="div">
        {t("group-contacts.joined-group-description", {
          ns: "layout",
        })}
      </ListSubheader>
      <ListItemButton component={MuiNavLink} to={ViewType.GroupRequests}>
        <ListItemIcon>
          <Avatar src={joinedGroupsImg} />
        </ListItemIcon>
        <ListItemText>{t("group-contacts.requests-invitations", { ns: "layout" })}</ListItemText>
      </ListItemButton>
      <Divider variant="middle" />
      <ListItemButton onClick={() => setHiddenGroup(!hiddenGroup)}>
        <ListItemText>
          {t("group-contacts.group", {
            ns: "layout",
            count: groups.length,
          })}
        </ListItemText>
        <FontAwesomeIcon icon={hiddenGroup ? "angle-down" : "angle-up"} />
      </ListItemButton>
      <Collapse in={hiddenGroup} timeout="auto">
        <MenuList disablePadding>
          {groups.map((group) => (
            <GroupOption key={group.groupId} group={group} />
          ))}
        </MenuList>
      </Collapse>
    </MenuList>
  );
}
