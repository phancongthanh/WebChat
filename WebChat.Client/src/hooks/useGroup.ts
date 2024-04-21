import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Group from "../types/Group";
import { groupsClient } from "../backend";
import { AppDispatch, RootState } from "../store";
import { setGroup, setNotFoundGroup } from "../store/groupsSlice";

export default function useGroup(groupId: string): Group | null {
  // Get group data from store
  const group = useSelector<RootState, Group | null | undefined>((state) => state.groups[groupId]);
  // Get dispatch function
  const dispatch = useDispatch<AppDispatch>();
  // Load group data from backend if group is undefined
  useEffect(() => {
    if (group === undefined) {
      groupsClient
        .get(groupId)
        .then((g) => g && dispatch(setGroup(g)))
        .catch(() => dispatch(setNotFoundGroup(groupId)));
    }
  }, [groupId, group, dispatch]);
  // Return group data
  return group || null;
}
