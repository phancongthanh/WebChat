import { useTranslation } from "react-i18next";
import { ViewType } from "../ViewType";

export interface TabsProps {
  view: ViewType;
  setView(view: ViewType): void;
}

export default function Tabs({ view, setView }: TabsProps) {
  const { t } = useTranslation();
  return (
    <div className="tabs border-0 border-b border-solid border-gray-300">
      <div className="tabs-item inline-block relative p-0 w-1/2 text-center">
        <button className={view === ViewType.SignUp ? "active" : undefined} onClick={() => setView(ViewType.SignUp)}>
          {t("tabs.sign-up", { ns: "account" })}
        </button>
      </div>
      <div className="tabs-item inline-block relative p-0 w-1/2 text-center">
        <button className={view === ViewType.Login ? "active" : undefined} onClick={() => setView(ViewType.Login)}>
          {t("tabs.login", { ns: "account" })}
        </button>
      </div>
    </div>
  );
}
