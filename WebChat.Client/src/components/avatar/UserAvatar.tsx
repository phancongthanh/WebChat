import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { avatarsClient } from "../../backend";
import useUser from "../../hooks/useUser";

export default function UserAvatar({ userId, size, onClick }: { userId: string; size: number; onClick?: () => void }) {
  const user = useUser(userId);
  const [avatarPath, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    avatarsClient
      .getUserUrl(userId)
      .then((path) => setAvatar(path))
      .catch(() => setAvatar(undefined));
  }, [userId]);

  const name = user?.name
    .split(" ")
    .filter((s) => s && s.length)
    .filter((_, i) => i < 2)
    .map((s) => s.charAt(0).toLocaleUpperCase())
    .join("");

  return (
    <Avatar
      className="user-avatar"
      sx={{
        width: size,
        height: size,
        border: "1px solid white",
        boxSizing: "border-box",
        cursor: onClick ? "pointer" : "default",
        fontSize: size / 2 + "px",
      }}
      alt={user?.name}
      src={user?.avatar ? avatarPath : undefined}
      onClick={onClick}
    >
      {name}
    </Avatar>
  );
}
