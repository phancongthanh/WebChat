import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, List, Popover, Stack, TextareaAutosize, Tooltip } from "@mui/material";
import { SystemInfo } from "../../../types/SystemInfo";
import { RootState } from "../../../store";
import SquareIcon from "../../../components/SquareIcon";
import EmojiPicker, { EmojiProps } from "../../../components/emoji/EmojiPicker";
import FileItem from "./FileItem";

export default function ChatBar({
  placeholder,
  onSend,
}: {
  placeholder?: string;
  onSend: (text: string, files: File[]) => Promise<unknown> | unknown;
}) {
  const { t } = useTranslation();
  const { maxFileSize, maxFileCountPerMessage } = useSelector<RootState, SystemInfo>((state) => state.system);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const isValid = files.length
    ? files.length <= maxFileCountPerMessage && files.every((f) => f.size <= maxFileSize * 1024 * 1024)
    : text;

  function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const fs = e.target.files;
    if (fs) setFiles(Array.from(fs));
  }

  // get cursor position and add the emoji to message string
  const handleEmojiSelect = (emoji: EmojiProps) => {
    // code reference: https://stackoverflow.com/a/70046604/12898748
    if (!inputRef?.current) return;
    setAnchorEl(null);
    const input = inputRef.current;

    const cursorPosition = input.selectionStart || 0;
    // concat the emoji to the string
    const t = text.slice(0, cursorPosition) + emoji.native + text.slice(cursorPosition);
    setText(t);
    const newCursorPosition = cursorPosition + emoji.native!.length;
    // allow to add multiple emojis in the same position of string
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
      input.focus();
    }, 10);
  };

  const send = async () => {
    if (!text && !files.length) return;
    setLoading(true);
    onSend && (await onSend(text.trim(), files));
    setFiles([]);
    setText("");
    setLoading(false);
  };

  return (
    <Stack className="py-3" gap={1}>
      <List className="empty:hidden px-4 min-w-80 box-border w-fit max-w-full max-h-44 overflow-auto normal-scroll-bar">
        {files.map((file) => (
          <FileItem key={file.name} file={file} onDelete={() => setFiles(files.filter((f) => f !== file))} />
        ))}
      </List>
      <Stack className="px-4 text-gray-700" direction="row" alignItems="end" gap={1}>
        <Stack
          justifyContent="center"
          className="flex-1 hover:bg-gray-100 focus-within:border-blue-500 overflow-hidden rounded-2xl box-border border border-solid"
          tabIndex={-1}
        >
          <TextareaAutosize
            className="resize-none outline-none border-none bg-transparent w-full box-border text-base text-inherit py-2 px-3 normal-scroll-bar"
            maxRows={4}
            placeholder={placeholder || t("chat-bar.placeholder", { ns: "views" })}
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value.trimStart())}
          />
        </Stack>
        <Tooltip title={t("chat-bar.emoji", { ns: "views" })}>
          <IconButton
            className="hover:text-blue-500 text-inherit"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <SquareIcon>
              <FontAwesomeIcon icon={["far", "face-smile"]} />
            </SquareIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title={t("chat-bar.attach-file", { ns: "views" })}>
          <label className="hover:text-blue-500 h-6 cursor-pointer text-2xl rounded-full hover:bg-gray-100 p-2">
            <input className="hidden" type="file" multiple onInput={handleUploadFile} />
            <SquareIcon className=" w-6">
              <FontAwesomeIcon icon="paperclip" />
            </SquareIcon>
          </label>
        </Tooltip>
        <Tooltip
          title={
            files.length <= maxFileCountPerMessage
              ? t("chat-bar.send", { ns: "views" })
              : t("chat-bar.too-many-files", { ns: "views", count: maxFileCountPerMessage })
          }
        >
          <Box>
            <IconButton className="hover:text-blue-500 text-inherit" disabled={!isValid || isLoading} onClick={send}>
              <SquareIcon>
                <FontAwesomeIcon icon={["far", "paper-plane"]} />
              </SquareIcon>
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        slotProps={{ paper: { className: "overflow-hidden rounded-lg" } }}
      >
        <EmojiPicker onSelect={handleEmojiSelect} />
      </Popover>
    </Stack>
  );
}
