import React from "react";

export interface EmojiRenderProps {
  id?: string;
  shortcodes?: string;
  native?: string;
  size?: unknown;
  fallback?: string;
  set?: "native" | "apple" | "facebook" | "google" | "twitter";
  skin?: 1 | 2 | 3 | 4 | 5 | 6;
}
const EmojiRender = (props: EmojiRenderProps) => React.createElement("em-emoji", props);

export default EmojiRender;
