import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { avatarsClient } from "../../backend";
import useGroup from "../../hooks/useGroup";

export default function GroupAvatar({
  groupId,
  size,
  onClick,
}: {
  groupId: string;
  size: number;
  onClick?: () => void;
}) {
  const group = useGroup(groupId);
  const [avatarPath, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    avatarsClient
      .getGroupUrl(groupId)
      .then((path) => setAvatar(path))
      .catch(() => setAvatar(undefined));
  }, [groupId]);

  const name = group?.name
    .split(" ")
    .filter((s) => s && s.length)
    .filter((_, i) => i < 2)
    .map((s) => s.charAt(0).toLocaleUpperCase())
    .join("");

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        border: "1px solid white",
        boxSizing: "border-box",
        cursor: onClick ? "pointer" : "default",
        fontSize: size / 2 + "px",
      }}
      alt={group?.name}
      src={group?.avatar ? avatarPath : undefined}
      onClick={onClick}
    >
      {name}
    </Avatar>
  );
}
