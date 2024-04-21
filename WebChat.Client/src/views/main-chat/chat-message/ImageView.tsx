import { useEffect, useMemo, useState } from "react";
import { ImageList, ImageListItem } from "@mui/material";
import { Message } from "../../../types/Conversation";
import FileMetadata from "../../../types/FileMetadata";
import FileUtils from "../../../utils/file-utils";
import { conversationsClient } from "../../../backend";
import ActiveComponent from "../../../components/ActiveComponent";

function ImageItem({
  conversationId,
  messageId,
  file,
}: {
  conversationId: string;
  messageId: number;
  file: FileMetadata;
}) {
  const [img, setImg] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!img)
      conversationsClient
        .getFile(conversationId, messageId, file.path)
        .then((f) => f && setImg(URL.createObjectURL(f)));
  }, [conversationId, messageId, file, img]);

  return (
    <ImageListItem key={file.name} className="rounded overflow-hidden">
      <img
        // srcSet={`${URL.createObjectURL(file)}?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={img}
        alt={file.name}
      />
    </ImageListItem>
  );
}
export default function ImageView({ message }: { message: Message }) {
  const images = useMemo(() => message.files.filter((file) => FileUtils.isImage(file)), [message]);
  return (
    <ActiveComponent condition={images.length}>
      <ImageList className="m-0" variant="masonry" cols={images.length > 3 ? 3 : images.length} gap={8}>
        {images.map((file) => (
          <ImageItem
            key={file.path}
            conversationId={message.conversationId}
            messageId={message.messageId}
            file={file}
          />
        ))}
      </ImageList>
    </ActiveComponent>
  );
}
