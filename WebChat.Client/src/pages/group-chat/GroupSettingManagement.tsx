import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, List, ListItem, ListItemText, Stack, Switch, TextField, Typography } from "@mui/material";
import { MemberRole } from "../../enums/MemberRole";
import Group, { GroupSetting } from "../../types/Group";
import GroupUtils from "../../utils/group-utils";
import { AppDispatch } from "../../store";
import { updateGroupSetting } from "../../thunks/groupThunk";

export default function GroupSettingManagement({ group }: { group: Group }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [hidden, setHidden] = useState(false);

  const isLeader = GroupUtils.getMember(group)?.role === MemberRole.Leader;

  const handleChange = (key: string, value: unknown) => {
    const setting = { ...group.setting } as unknown as { [index: string]: unknown };
    if (setting[key] == value) return;
    setting[key] = value;
    dispatch(updateGroupSetting({ groupId: group.groupId, setting: setting as unknown as GroupSetting }));
  };

  return (
    <>
      <ListItem onClick={() => setHidden(!hidden)}>
        <ListItemText className="cursor-pointer">
          <Typography className="text-base font-medium text-black">
            {t("group-chat.info.header.manage", { ns: "pages" })}
          </Typography>
        </ListItemText>
        <FontAwesomeIcon icon={hidden ? "angle-right" : "angle-down"} />
      </ListItem>
      <Collapse in={!hidden} timeout="auto">
        <List>
          <ListItem>
            <ListItemText>
              <Typography className="text-sm">
                {t("group-chat.info.setting.allowChangeGName", { ns: "pages" })}
              </Typography>
            </ListItemText>
            <Switch
              disabled={!isLeader}
              size="small"
              edge="end"
              checked={group.setting.allowChangeGName}
              onChange={(_, checked) => handleChange("allowChangeGName", checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography className="text-sm">
                {t("group-chat.info.setting.allowSendGInvitation", { ns: "pages" })}
              </Typography>
            </ListItemText>
            <Switch
              disabled={!isLeader}
              size="small"
              edge="end"
              checked={group.setting.allowSendGInvitation}
              onChange={(_, checked) => handleChange("allowSendGInvitation", checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography className="text-sm">
                {t("group-chat.info.setting.membershipApproval", { ns: "pages" })}
              </Typography>
            </ListItemText>
            <Switch
              disabled={!isLeader}
              size="small"
              edge="end"
              checked={group.setting.membershipApproval}
              onChange={(_, checked) => handleChange("membershipApproval", checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography className="text-sm">
                {t("group-chat.info.setting.readRecentMessage", { ns: "pages" })}
              </Typography>
            </ListItemText>
            <Switch
              disabled={!isLeader}
              size="small"
              edge="end"
              checked={group.setting.readRecentMessage}
              onChange={(_, checked) => handleChange("readRecentMessage", checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography className="text-sm">
                {t("group-chat.info.setting.joinGroupByLink", { ns: "pages" })}
              </Typography>
              <Stack direction="row" alignItems="center" className="text-sm" gap={1}>
                {t("group-chat.info.setting.groupCode", { ns: "pages" })}:
                <TextField
                  disabled={!isLeader}
                  inputProps={{ className: "py-1 px-2 text-sm" }}
                  size="small"
                  defaultValue={group.setting.groupCode}
                  onBlur={(event) => handleChange("groupCode", event.currentTarget.value)}
                />
              </Stack>
            </ListItemText>
            <Switch
              disabled={!isLeader}
              size="small"
              edge="end"
              checked={group.setting.joinGroupByLink}
              onChange={(_, checked) => handleChange("joinGroupByLink", checked)}
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
