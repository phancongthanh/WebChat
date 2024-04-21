import { useSelector } from "react-redux";
import { RootState } from "../store";
import { AuthState } from "../store/authSlice";

export default function useAuth(): AuthState {
  const auth = useSelector<RootState, AuthState>((state) => state.auth);
  return auth;
}
