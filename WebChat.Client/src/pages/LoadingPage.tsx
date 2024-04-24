import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import UnauthorizedError from "../types/errors/UnauthorizedError";
import { conversationsClient, friendsClient, groupsClient, systemClient, usersClient } from "../backend";
import auth from "../backend/auth";
import { AppDispatch } from "../store";
import { setAuth } from "../store/authSlice";
import { setConversations } from "../store/conversationsSlice";
import { showError } from "../store/errorSlice";
import { setGroups } from "../store/groupsSlice";
import { connectWebSocket } from "../store/middlewares/socket-middleware";
import { setInfo } from "../store/systemSlice";
import { setUsers } from "../store/usersSlice";

let loaded = false;

export default function LoadingPage({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function load() {
      const systemInfo = await systemClient.getInfo();
      dispatch(setInfo(systemInfo));
      // step 1
      await auth.checkLogged().then((islogged) => islogged || dispatch(showError(new UnauthorizedError())));
      setStep(1);
      // step 2
      const currentUser = await usersClient.getCurrent();
      dispatch(setAuth(currentUser));
      setStep(2);
      // step 3
      const friends = await friendsClient.getList();
      dispatch(setUsers(friends));
      setStep(3);
      // step 4
      const groups = await groupsClient.getList();
      dispatch(setGroups(groups));
      setStep(4);
      // step 5
      const conversations = await conversationsClient.getList();
      dispatch(setConversations(conversations));
      setStep(5);
      // step 6
      dispatch(connectWebSocket());
      setStep(6);
    }
    if (loaded) return;
    loaded = true;
    load();
  }, [dispatch]);

  switch (step) {
    case 0:
      return t("loading.step-1", { ns: "pages" });
    case 1:
      return t("loading.step-2", { ns: "pages" });
    case 2:
      return t("loading.step-3", { ns: "pages" });
    case 3:
      return t("loading.step-4", { ns: "pages" });
    case 4:
      return t("loading.step-5", { ns: "pages" });
    case 5:
      return t("loading.step-6", { ns: "pages" });
    default:
      return children;
  }
}
