import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Message } from "../../../types/Conversation";
import FileMetadata from "../../../types/FileMetadata";
import FileUtils from "../../../utils/file-utils";
import { conversationsClient } from "../../../backend";
import ActiveComponent from "../../../components/ActiveComponent";
import SquareIcon from "../../../components/SquareIcon";

function FileItem({
  conversationId,
  messageId,
  file,
}: {
  conversationId: string;
  messageId: number;
  file: FileMetadata;
}) {
  const handleDownload = async (metadata: FileMetadata) => {
    const file = await conversationsClient.getFile(conversationId, messageId, metadata.path);
    if (!file) return;
    const blob = new Blob([file]);
    FileUtils.downloadFile(metadata.name, blob);
  };

  return (
    <ListItem key={file.path} disablePadding>
      <ListItemIcon className="min-w-max mr-2">
        <SquareIcon className=" text-xl">
          <FontAwesomeIcon icon={["far", "file"]} />
        </SquareIcon>
      </ListItemIcon>
      <ListItemText>
        <Typography className="whitespace-nowrap text-ellipsis overflow-hidden">{file.name}</Typography>
      </ListItemText>
      <IconButton color="primary" onClick={() => handleDownload(file)}>
        <SquareIcon className="text-xs">
          <FontAwesomeIcon icon="download" />
        </SquareIcon>
      </IconButton>
    </ListItem>
  );
}

export default function FileView({ message }: { message: Message }) {
  const files = useMemo(() => message.files.filter((file) => !FileUtils.isImage(file)), [message]);

  return (
    <ActiveComponent condition={files.length}>
      <List className="max-w-max">
        {files.map((file) => (
          <FileItem key={file.path} conversationId={message.conversationId} messageId={message.messageId} file={file} />
        ))}
      </List>
    </ActiveComponent>
  );
}
