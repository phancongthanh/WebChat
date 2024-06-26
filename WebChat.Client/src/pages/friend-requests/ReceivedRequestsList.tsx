import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";
import User from "../../types/User";
import { RootState } from "../../store";
import ActiveComponent from "../../components/ActiveComponent";
import RequestView from "./RequestView";

export default function ReceivedRequestsList() {
  const { t } = useTranslation();
  const users = useSelector<RootState, object>((state) => state.users);

  const requests = useMemo(
    () =>
      Object.values(users)
        .filter((u: User | null | undefined) => u?.requestOfFriend)
        .map((user: User) => <RequestView key={user.userId} user={user} />),
    [users],
  );

  return (
    <ActiveComponent condition={requests.length}>
      <Stack className="requests-list" gap={2} margin="16px 0">
        <Typography fontWeight="bold">
          {t("friend-requests.received-requests", {
            ns: "pages",
            count: requests.length,
          })}
        </Typography>
        {requests}
      </Stack>
    </ActiveComponent>
  );
}
