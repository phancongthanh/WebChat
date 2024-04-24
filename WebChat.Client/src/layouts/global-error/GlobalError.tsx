import { useDispatch, useSelector } from "react-redux";
import ApiError from "../../types/errors/ApiError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";
import { AppDispatch, RootState } from "../../store";
import { resetError } from "../../store/errorSlice";
import ApiErrorAlert from "./ApiErrorAlert";
import UnauthorizedErrorAlert from "./UnauthorizedErrorAlert";
import UnknownErrorAlert from "./UnknownErrorAlert";

export default function GlobalError() {
  const error = useSelector<RootState>((state) => state.error);
  const dispatch = useDispatch<AppDispatch>();
  const handleClose = () => dispatch(resetError());

  if (!error) return <></>;
  console.log(error);
  if (ApiError.isApiError(error)) {
    return <ApiErrorAlert error={error} onClose={handleClose} />;
  } else if (UnauthorizedError.isUnauthorizedError(error)) {
    return <UnauthorizedErrorAlert open={true} onClose={handleClose} />;
  } else {
    return <UnknownErrorAlert open={true} onClose={handleClose} />;
  }
}
