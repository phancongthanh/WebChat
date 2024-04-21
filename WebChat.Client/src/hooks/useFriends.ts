import { useMemo } from "react";
import { useSelector } from "react-redux";
import User from "../types/User";
import { RootState } from "../store";

export default function useFriends() {
  // Get users data from store
  const users = useSelector<RootState, object>((state) => state.users);

  const friends = useMemo(
    () =>
      Object.values(users)
        .filter((f) => f)
        .filter((f) => f?.isFriend)
        .sort((a: User, b: User) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)) as User[],
    [users],
  );

  return friends;
}
