import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { MessageStatus } from "../../../enums/MessageStatus";
import { Message } from "../../../types/Conversation";
import ActiveComponent from "../../../components/ActiveComponent";

export default function StatusView({ message }: { message: Message }) {
  const { t } = useTranslation();
  const time = new Date(message.sendTime);
  const hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return (
    <Box>
      <Typography className="message-time float-left text-xs text-gray-500">{hour + ":" + minutes}</Typography>
      <Typography className="message-status float-right text-xs text-gray-500 ml-2">
        <ActiveComponent condition={message.status === MessageStatus.Sending}>
          {t("message-status.sending")}
        </ActiveComponent>
        <ActiveComponent condition={message.status === MessageStatus.Sent}>{t("message-status.sent")}</ActiveComponent>
        <ActiveComponent condition={message.status === MessageStatus.Received}>
          {t("message-status.received")}
        </ActiveComponent>
        <ActiveComponent condition={message.status === MessageStatus.Seen}>{t("message-status.seen")}</ActiveComponent>
      </Typography>
    </Box>
  );
}
