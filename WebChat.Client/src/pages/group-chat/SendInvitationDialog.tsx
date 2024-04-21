import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import User from "../../types/User";
import GroupUtils from "../../utils/group-utils";
import { AppDispatch, RootState } from "../../store";
import useGroup from "../../hooks/useGroup";
import { sendGroupInvitation } from "../../thunks/groupThunk";
import ActiveComponent from "../../components/ActiveComponent";
import FormDialog from "../../components/FormDialog";
import UserAvatar from "../../components/avatar/UserAvatar";

function UserOption({ user, onChange }: { user: User; onChange: (userId: string, checked: boolean) => void }) {
  return (
    <FormLabel key={user.userId}>
      <ListItem
        className="hover:bg-neutral-100 rounded cursor-pointer"
        secondaryAction={
          <Checkbox name="userIds" value={user.userId} onChange={(_, checked) => onChange(user.userId, checked)} />
        }
      >
        <ListItemAvatar>
          <UserAvatar userId={user.userId} size={40} />
        </ListItemAvatar>
        <ListItemText>{user.alias || user.name}</ListItemText>
      </ListItem>
    </FormLabel>
  );
}

export default function SendInvitationDialog({
  open,
  groupId,
  onClose,
}: {
  open: boolean;
  groupId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const group = useGroup(groupId as string);
  const users = useSelector<RootState, object>((state) => state.users);

  const [text, changeText] = useState("");
  const inputRef = useRef<{ focus: () => void }>();
  const [userIds, setUserIds] = useState<string[]>([]);

  const userList = useMemo(
    () =>
      Object.values(users)
        .filter((u: User | null | undefined) => u)
        .filter((u: User) => !text || u.name.includes(text))
        .filter((u: User) => group && !GroupUtils.includes(group, u.userId)),
    [users, group, text],
  );

  const searchResult = useMemo(() => (text ? userList.filter((u) => !u.conversationId) : []), [userList, text]);
  const recents = useMemo(() => userList.filter((u) => !u.isFriend && u.conversationId), [userList]);
  const friends = useMemo(() => userList.filter((u) => u.isFriend), [userList]);

  const handleClear = () => {
    changeText("");
    inputRef.current?.focus();
  };
  const handleChange = (userId: string, checked: boolean) => {
    if (checked && !userIds.includes(userId)) setUserIds([...userIds, userId]);
    if (!checked && userIds.includes(userId)) setUserIds(userIds.filter((id) => id !== userId));
  };
  const handleSubmit = async () => {
    if (!groupId) return;
    const successed = await dispatch(sendGroupInvitation({ groupId, userIds })).unwrap();
    if (successed) onClose();
  };

  const inputProps = {
    className: "rounded-full",
    startAdornment: (
      <InputAdornment position="start" disablePointerEvents>
        <FontAwesomeIcon icon="magnifying-glass" />
      </InputAdornment>
    ),
    endAdornment: (
      <ActiveComponent condition={text}>
        <InputAdornment position="end" onClick={handleClear}>
          <FontAwesomeIcon className="text-red-500 cursor-pointer" icon="circle-xmark" />
        </InputAdornment>
      </ActiveComponent>
    ),
  };

  return (
    <FormDialog
      open={Boolean(group) && open}
      title={t("group-chat.send-invitation.title", { ns: "pages" })}
      isValid={userIds.length > 0}
      okBtnProps={{ onClick: handleSubmit }}
      onClose={onClose}
    >
      <Stack className="w-80" gap={2}>
        <FormControl fullWidth>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            InputProps={inputProps}
            inputRef={inputRef}
            value={text}
            onChange={(e) => changeText(e.target.value)}
            placeholder={t("group-chat.send-invitation.search-placeholder", { ns: "pages" })}
          />
        </FormControl>
        <ActiveComponent condition={searchResult.length}>
          <FormGroup>
            <FormLabel>
              {t("group-chat.send-invitation.search-result", {
                ns: "pages",
              })}
            </FormLabel>
            <List className="relative overflow-auto max-h-80 normal-scroll-bar" disablePadding>
              {searchResult.map((user) => (
                <UserOption key={user.userId} user={user} onChange={handleChange} />
              ))}
            </List>
          </FormGroup>
        </ActiveComponent>
        <ActiveComponent condition={recents.length}>
          <FormGroup>
            <FormLabel>
              {t("group-chat.send-invitation.recent", {
                ns: "pages",
              })}
            </FormLabel>
            <List className="relative overflow-auto max-h-80 normal-scroll-bar" disablePadding>
              {recents.map((user) => (
                <UserOption key={user.userId} user={user} onChange={handleChange} />
              ))}
            </List>
          </FormGroup>
        </ActiveComponent>
        <ActiveComponent condition={friends.length}>
          <FormGroup>
            <FormLabel>
              {t("group-chat.send-invitation.friends", {
                ns: "pages",
              })}
            </FormLabel>
            <List className="relative overflow-auto max-h-80 normal-scroll-bar" disablePadding>
              {friends.map((friend) => (
                <UserOption key={friend.userId} user={friend} onChange={handleChange} />
              ))}
            </List>
          </FormGroup>
        </ActiveComponent>
      </Stack>
    </FormDialog>
  );
}
