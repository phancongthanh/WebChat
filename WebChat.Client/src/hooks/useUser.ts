import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import User from "../types/User";
import { usersClient } from "../backend";
import { AppDispatch, RootState } from "../store";
import { setNotFoundUser, setUser } from "../store/usersSlice";

export default function useUser(userId: string): User | null {
  // Get user data from store
  const user = useSelector<RootState, User | null | undefined>((state) => state.users[userId]);
  // Get dispatch function
  const dispatch = useDispatch<AppDispatch>();
  // Load user data from backend if user is undefined
  useEffect(() => {
    if (user === undefined) {
      usersClient
        .get(userId)
        .then((u) => u && dispatch(setUser(u)))
        .catch(() => dispatch(setNotFoundUser(userId)));
    }
  }, [userId, user, dispatch]);
  // Return user data
  return user || null;
}
