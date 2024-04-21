import { useMemo } from "react";
import { useSelector } from "react-redux";
import Group, { GroupMember } from "../types/Group";
import { RootState } from "../store";

export default function useGroups() {
  const currentUserId = useSelector<RootState, string>((state) => state.auth.userId);

  // Get groups data from store
  const gs = useSelector<RootState, object>((state) => state.groups);

  const groups = useMemo(
    () =>
      Object.values(gs)
        .filter((g) => g)
        .filter((g) => g.members.some((m: GroupMember) => m.userId === currentUserId))
        .sort((a: Group, b: Group) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)) as Group[],
    [gs, currentUserId],
  );

  return { groups };
}
