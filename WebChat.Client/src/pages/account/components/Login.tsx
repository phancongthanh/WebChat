import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { PhoneNumber } from "../../../types/PhoneNumber";
import ApiError from "../../../types/errors/ApiError";
import auth from "../../../backend/auth";
import ApiErrorAlert from "../../../layouts/global-error/ApiErrorAlert";

const useSchema = (t: TFunction) =>
  yup.object().shape({
    country: yup
      .string()
      .required(t("fields.validate-errors.country", { ns: "account" }))
      .matches(/^\d{1,3}$/, t("fields.validate-errors.country", { ns: "account" })),
    phone: yup
      .string()
      .required(t("fields.validate-errors.phone.required", { ns: "account" }))
      .matches(/^0[1-9][0-9]{6,14}$/, t("fields.validate-errors.phone.invalid", { ns: "account" })),
    password: yup
      .string()
      .required(t("password.required"))
      .matches(/[A-Z]+/, t("password.requireUppercase"))
      .matches(/[a-z]+/, t("password.requireLowercase"))
      .matches(/\d+/, t("password.requireDigit"))
      .matches(
        /[@$!%*?&]+/,
        t("password.requiredUniqueChars", {
          chars: "@$!%*?&",
        }),
      )
      .min(
        8,
        t("password.minLength", {
          length: 8,
        }),
      )
      .matches(
        /^[A-Za-z0-9@$!%*?&]{8,}$/,
        t("password.invalid", {
          chars: "@$!%*?&",
        }),
      ),
  });

const initialValues = {
  country: "84",
  phone: "0123456789",
  password: "Test@123",
};

export default function Login({ forgot }: { forgot(): void }) {
  const { t } = useTranslation();
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [errorDes, setDes] = useState<string | undefined>(undefined);
  const schema = useSchema(t);

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      const phone = new PhoneNumber(values.country, values.phone);
      try {
        await auth.login(phone, values.password);
        const params = new URL(window.location.toString()).searchParams;
        const returnUrl = params.get("returnUrl");
        if (returnUrl) window.location.replace(returnUrl);
        else window.location.reload();
      } catch (e) {
        if (ApiError.isApiError(e)) setError(e);
      }
    },
  });

  return (
    <>
      <form
        className="flex flex-col gap-3 px-10 py-7"
        onKeyDown={(event) => event.key === "Enter" && formik.handleSubmit()}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon="mobile-screen" />
                <select
                  style={{
                    border: "none",
                    marginLeft: "15px",
                    fontSize: "inherit",
                  }}
                >
                  <option>+84</option>
                </select>
              </InputAdornment>
            ),
          }}
          placeholder={t("fields.phone", { ns: "account" })}
          name="phone"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          error={formik.touched.phone && !!formik.errors.phone}
          helperText={formik.touched.phone && formik.errors.phone}
        />
        <TextField
          variant="standard"
          fullWidth
          type="password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon="lock" />
              </InputAdornment>
            ),
          }}
          placeholder={t("fields.password", { ns: "account" })}
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
        />
        {errorDes && <em className="error">{errorDes}</em>}
        <Button
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {t("login.btns.submit", { ns: "account" })}
        </Button>
        <div className="flex justify-center overflow-hidden h-5 btn--back m-0 p-0">
          <div className="text-sm hover:underline cursor-pointer hover:text-blue-500" onClick={forgot}>
            {t("login.btns.forgot", { ns: "account" })}
          </div>
        </div>
      </form>
      <ApiErrorAlert error={error} onClose={({ description }) => setDes(description)} />
    </>
  );
}
