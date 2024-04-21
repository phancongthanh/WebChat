import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItemAvatar, ListItemText, ListSubheader, MenuItem, MenuList } from "@mui/material";
import useGroup from "../../../hooks/useGroup";
import SquareIcon from "../../../components/SquareIcon";
import GroupAvatar from "../../../components/avatar/GroupAvatar";

function SearchHistoryItem({
  groupId,
  openProfile,
  onDelete,
}: {
  groupId: string;
  openProfile: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
}) {
  const group = useGroup(groupId);
  return (
    <MenuItem key={groupId} onClick={() => openProfile(groupId)} sx={{ borderRadius: "5px" }}>
      <ListItemAvatar>
        <GroupAvatar groupId={groupId} size={32} />
      </ListItemAvatar>
      <ListItemText sx={{ textAlign: "left" }} primary={group?.name} />
      {onDelete && (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(groupId);
          }}
          color="error"
        >
          <SquareIcon>
            <FontAwesomeIcon icon="trash-can" size="xs" />
          </SquareIcon>
        </IconButton>
      )}
    </MenuItem>
  );
}

export default function SearchHistory({
  groupIds,
  openProfile,
  onDelete,
}: {
  groupIds: string[];
  openProfile: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
}) {
  const { t } = useTranslation();
  if (!groupIds.length) return <span>{t("group-contacts.search.no-recent-searches", { ns: "layout" })}</span>;

  return (
    <MenuList
      subheader={
        <ListSubheader className="p-0 text-left" component="div">
          {t("group-contacts.search.recent-searches", { ns: "layout" })}
        </ListSubheader>
      }
    >
      {groupIds.map((id) => (
        <SearchHistoryItem key={id} groupId={id} openProfile={openProfile} onDelete={onDelete} />
      ))}
    </MenuList>
  );
}
