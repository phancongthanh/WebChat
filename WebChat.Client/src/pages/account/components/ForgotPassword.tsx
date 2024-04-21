import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, InputAdornment, TextField } from "@mui/material";

export default function ForgotPassword({ back }: { back(): void }) {
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();
  const findPassword = () => alert(t("forgot.error-message", { ns: "account" }));
  return (
    <div className="text-center py-6 px-11">
      <p className="text-base my-5">{t("forgot.title", { ns: "account" })}</p>
      <TextField
        fullWidth
        placeholder={t("fields.phone", { ns: "account" })}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon="mobile-screen" />
              <select className="border-none ml-4">
                <option>+84</option>
              </select>
            </InputAdornment>
          ),
        }}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button
        className="text-white my-5"
        fullWidth
        size="large"
        variant="contained"
        disabled={phone.length < 9}
        onClick={() => findPassword()}
      >
        {t("forgot.btn.next", { ns: "account" })}
      </Button>
      <div className="flex justify-start overflow-hidden h-5 btn--back m-0 p-0">
        <div className="text-sm hover:underline cursor-pointer hover:text-blue-500" onClick={back}>
          <FontAwesomeIcon icon="angles-left" />
          &nbsp;
          {t("forgot.btn.back", { ns: "account" })}
        </div>
      </div>
    </div>
  );
}
