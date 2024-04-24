import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledEngineProvider } from "@mui/material";
import "../../assets/css/account-page.css";
import { Language } from "../../enums/Language";
import { storage } from "../../utils/storage-management";
import ActiveComponent from "../../components/ActiveComponent";
import ForgotPassword from "./components/ForgotPassword";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Tabs from "./components/Tabs";
import { ViewType } from "./ViewType";

export default function AccountPage() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState(ViewType.Login);

  useEffect(() => {
    switch (view) {
      case ViewType.Forgot:
        document.title = t("title.forgot", { ns: "account" });
        break;
      case ViewType.SignUp:
        document.title = t("title.sign-up", { ns: "account" });
        break;
      case ViewType.Login:
      default:
        document.title = t("title.login", { ns: "account" });
    }
  }, [view, t]);

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    storage.setLanguage(language);
  };

  return (
    <StyledEngineProvider injectFirst>
      <div className="account-page h-full bg-gray-200 disable-scroll-bar">
        <div className="account w-full min-h-ful">
          <header>
            <h1 className="my-5 text-center h-20">
              <img className="inline-block h-full" src="/logo.png" alt="logo" height={80} />
            </h1>
            <h2 className="font-normal text-center text-lg my-2.5">
              {t("header.first", { ns: "account" })}
              <br />
              {t("header.last", { ns: "account" })}
            </h2>
          </header>
          <main className="h-auto flex flex-col min-w-80">
            <div className="content rounded-lg bg-white w-96 m-auto shadow-lg">
              <ActiveComponent condition={view === ViewType.Forgot}>
                <ForgotPassword back={() => setView(ViewType.Login)} />
              </ActiveComponent>
              <ActiveComponent condition={view === ViewType.Login}>
                <Tabs view={view} setView={setView} />
                <Login forgot={() => setView(ViewType.Forgot)} />
              </ActiveComponent>
              <ActiveComponent condition={view === ViewType.SignUp}>
                <Tabs view={view} setView={setView} />
                <SignUp />
              </ActiveComponent>
            </div>
          </main>
          <footer className="mt-4">
            <div className="text-center">
              <span
                className="text-sm text-blue-500 cursor-pointer mr-4 hover:underline"
                onClick={() => changeLanguage(Language.VI)}
              >
                {i18n.language === Language.VI ? <b>Tiếng việt</b> : "Tiếng việt"}
              </span>
              <span
                className="text-sm text-blue-500 cursor-pointer mr-4 hover:underline"
                onClick={() => changeLanguage(Language.EN)}
              >
                {i18n.language === Language.EN ? <b>English</b> : "English"}
              </span>
            </div>
          </footer>
        </div>
      </div>
    </StyledEngineProvider>
  );
}
