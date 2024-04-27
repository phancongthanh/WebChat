import React, { ReactNode } from "react";
import { toArray } from "react-emoji-render";
import EmojiRender from "./EmojiRender";

function splitTextWithEmoji(text: string) {
  const objects = toArray(text);
  const output = objects.map((current) => {
    if (typeof current === "string" || current instanceof String) {
      return {
        type: "string",
        value: current.toString(),
      };
    }
    if (React.isValidElement(current)) return { type: "native", value: current.props.children as string };
    return { type: null, value: current as string };
  });
  return output;
}

export default function TextWithEmojiRender({
  children,
  text,
  replaceEnter,
}: {
  children?: string;
  text?: string;
  replaceEnter?: boolean;
}) {
  const output = splitTextWithEmoji(children || text || "");
  const elements = output.map((e, index) => {
    switch (e.type) {
      case "string": {
        if (!replaceEnter) return <span key={index}>{e.value}</span>;
        const lines = e.value.split("\n");
        const result = [lines[0]] as Array<ReactNode>;
        for (let i = 1; i < lines.length; i++) {
          result.push(<br key={i} />);
          result.push(lines[i]);
        }
        return <span key={index}>{result}</span>;
      }
      case "native":
        return <EmojiRender key={index} native={e.value} set="apple" />;
      default:
        return e.value;
    }
  });
  return elements;
}
