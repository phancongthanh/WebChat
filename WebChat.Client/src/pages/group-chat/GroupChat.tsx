import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, Drawer, IconButton, List, Stack, Typography } from "@mui/material";
import GroupUtils from "../../utils/group-utils";
import useGlobalElement from "../../hooks/useGlobalElement";
import useGroup from "../../hooks/useGroup";
import Header from "../../layouts/Header";
import ActiveComponent from "../../components/ActiveComponent";
import SquareIcon from "../../components/SquareIcon";
import GroupAvatar from "../../components/avatar/GroupAvatar";
import MainChat from "../../views/main-chat/MainChat";
import ActionManagement from "./ActionManagement";
import GroupSettingManagement from "./GroupSettingManagement";
import InvitationManagement from "./InvitationManagement";
import MemberManagement from "./MemberManagement";
import RequestManagement from "./RequestManagement";
import SendInvitationDialog from "./SendInvitationDialog";

export default function GroupChat() {
  const { t } = useTranslation();
  const { showGroupProfile, updateGroupName } = useGlobalElement();
  const { groupId } = useParams();
  const group = useGroup(groupId as string);

  const [open, setOpen] = useState(false);
  const [modal, setMolal] = useState<"Send-Invitation" | null>(null);

  if (!groupId || !group) return undefined;
  return (
    <Stack sx={{ "& .MuiPaper-root": { position: "unset" } }} direction="row" flex={1}>
      <Stack className="w-0" direction="column" flex={1}>
        <Header>
          <GroupAvatar groupId={groupId} size={48} onClick={() => showGroupProfile(groupId)} />
          <Box className="flex-1 w-0">
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold" variant="h2">
                {group.name}
              </Typography>
              <ActiveComponent
                condition={group.setting.allowChangeGName || GroupUtils.isAdmin(GroupUtils.getMember(group)?.role)}
              >
                <IconButton size="small" onClick={() => updateGroupName(groupId)}>
                  <SquareIcon>
                    <FontAwesomeIcon icon="pen" size="xs" />
                  </SquareIcon>
                </IconButton>
              </ActiveComponent>
            </Stack>
            <Typography className="text-xs" color="secondary" variant="subtitle1">
              {t("group-chat.member", { ns: "pages", count: group?.numberOfMembers })}
            </Typography>
          </Box>
          <ActiveComponent
            condition={group.setting.allowSendGInvitation || GroupUtils.isAdmin(GroupUtils.getMember(group)?.role)}
          >
            <IconButton onClick={() => setMolal("Send-Invitation")}>
              <SquareIcon className="text-lg">
                <FontAwesomeIcon icon={["fas", "user-plus"]} />
              </SquareIcon>
            </IconButton>
          </ActiveComponent>
          <IconButton onClick={() => setOpen(!open)}>
            <SquareIcon className="text-lg">
              <FontAwesomeIcon icon={["fas", "circle-info"]} />
            </SquareIcon>
          </IconButton>
        </Header>
        <Divider />
        <MainChat conversationId={group?.conversationId} />
      </Stack>
      <SendInvitationDialog open={modal === "Send-Invitation"} groupId={groupId} onClose={() => setMolal(null)} />
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Stack className="h-screen max-h-screen w-screen sm:w-80">
          <Stack className="w-full h-16 relative" justifyContent="center" alignItems="center">
            <IconButton className="absolute left-3 inline-flex sm:hidden" onClick={() => setOpen(false)}>
              <SquareIcon>
                <FontAwesomeIcon icon="chevron-left" size="xs" />
              </SquareIcon>
            </IconButton>
            <Typography className="font-medium text-lg">{t("group-chat.info.title", { ns: "pages" })}</Typography>
          </Stack>
          <Divider />
          <List className="w-full h-0 flex-1 overflow-auto disable-scroll-bar" disablePadding>
            <Stack className="box-border w-full px-9 py-3" alignItems="center" textAlign="center">
              <Box className="my-3">
                <GroupAvatar groupId={group.groupId} size={56} />
              </Box>
              <Box position="relative">
                <Typography className="font-medium text-lg">{group.name}</Typography>
                <ActiveComponent
                  condition={group.setting.allowChangeGName || GroupUtils.isAdmin(GroupUtils.getMember(group)?.role)}
                >
                  <IconButton
                    className="absolute left-full top-1/2 translate-x-1 -translate-y-1/2"
                    size="small"
                    onClick={() => updateGroupName(groupId)}
                  >
                    <SquareIcon>
                      <FontAwesomeIcon icon="pen" size="xs" />
                    </SquareIcon>
                  </IconButton>
                </ActiveComponent>
              </Box>
            </Stack>
            <Divider className="border-b-8" />
            <GroupSettingManagement group={group} />
            <Divider className="border-b-8" />
            <MemberManagement group={group} />
            <Divider className="border-b-8" />
            <RequestManagement group={group} />
            <Divider className="border-b-8" />
            <InvitationManagement group={group} />
            <Divider className="border-b-8" />
            <ActionManagement group={group} />
          </List>
        </Stack>
      </Drawer>
    </Stack>
  );
}
