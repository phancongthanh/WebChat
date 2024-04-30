import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sendtomeImg from "../../assets/images/sendtome-img.png";

export default function ChatGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-4 text-sm w-80 max-w-full box-border mx-auto mt-5 flex flex-col items-center">
      <img className="mb-4" src={sendtomeImg} alt="img" />
      <div className="flex flex-row items-center">
        <div className="bg-emerald-300 w-9 h-9 mr-4 flex items-center justify-center rounded-full">
          <FontAwesomeIcon className="text-xl text-white" icon={["far", "image"]} />
        </div>
        <div className="flex-1">{t("chat-guide", { ns: "views" })}</div>
      </div>
    </div>
  );
}
