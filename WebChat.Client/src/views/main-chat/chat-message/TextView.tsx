import { Typography } from "@mui/material";
import { Message } from "../../../types/Conversation";
import ActiveComponent from "../../../components/ActiveComponent";
import TextWithEmojiRender from "../../../components/emoji/TextWithEmojiRender";

export default function TextView({ message }: { message: Message }) {
  return (
    <ActiveComponent condition={message.text}>
      <Typography className="message-text mb-1.5">
        <TextWithEmojiRender text={message.text} replaceEnter={true} />
      </Typography>
    </ActiveComponent>
  );
}
