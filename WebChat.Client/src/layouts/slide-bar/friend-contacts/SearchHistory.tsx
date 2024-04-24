import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItemAvatar, ListItemText, ListSubheader, MenuItem, MenuList } from "@mui/material";
import useUser from "../../../hooks/useUser";
import SquareIcon from "../../../components/SquareIcon";
import UserAvatar from "../../../components/avatar/UserAvatar";

function SearchHistoryItem({
  userId,
  openProfile,
  onDelete,
}: {
  userId: string;
  openProfile: (userId: string) => void;
  onDelete?: (userId: string) => void;
}) {
  const user = useUser(userId);
  return (
    <MenuItem key={userId} onClick={() => openProfile(userId)} sx={{ borderRadius: "5px" }}>
      <ListItemAvatar>
        <UserAvatar userId={userId} size={32} />
      </ListItemAvatar>
      <ListItemText sx={{ textAlign: "left" }} primary={user?.alias || user?.name} />
      {onDelete && (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(userId);
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
  userIds,
  openProfile,
  onDelete,
}: {
  userIds: string[];
  openProfile: (userId: string) => void;
  onDelete?: (userId: string) => void;
}) {
  const { t } = useTranslation();
  if (!userIds.length) return <span>{t("friend-contacts.search.no-recent-searches", { ns: "layouts" })}</span>;

  return (
    <MenuList
      subheader={
        <ListSubheader className="p-0 text-left" component="div">
          {t("friend-contacts.search.recent-searches", { ns: "layouts" })}
        </ListSubheader>
      }
    >
      {userIds.map((id) => (
        <SearchHistoryItem key={id} userId={id} openProfile={openProfile} onDelete={onDelete} />
      ))}
    </MenuList>
  );
}
