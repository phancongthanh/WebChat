import i18n from "@emoji-mart/data/i18n/vi.json";
import data from "@emoji-mart/data/sets/14/apple.json";
import Picker from "@emoji-mart/react";
import { Box } from "@mui/material";
import { Emoji } from "emoji-mart";
import { init } from "emoji-mart";

init({ data, i18n, set: "apple", locale: "vi" });

export type EmojiProps = typeof Emoji.Props;

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: EmojiProps) => void }) {
  return (
    <Box minWidth="352px">
      <Picker
        data={data}
        i18n={i18n}
        skinTonePosition="search"
        previewPosition="none"
        theme="light"
        set="apple"
        locale="vi"
        autoFocus={true}
        onEmojiSelect={onSelect}
      />
    </Box>
  );
}
