import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { Gender } from "../../../enums/Gender";
import { PhoneNumber } from "../../../types/PhoneNumber";
import ApiError from "../../../types/errors/ApiError";
import auth from "../../../backend/auth";
import ApiErrorAlert from "../../../layouts/global-error/ApiErrorAlert";
import BirthdayPicker from "../../../components/BirthdayPicker";

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
    name: yup
      .string()
      .required(t("fields.validate-errors.name.required", { ns: "account" }))
      .matches(/^[a-zA-Z\s,.'\-\p{L}]+$/u, t("fields.validate-errors.name.invalid", { ns: "account" })),
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
  phone: "",
  password: "",
  name: "",
  gender: Gender.Male as Gender,
  birthday: new Date(),
};

export default function SignUp() {
  const { t } = useTranslation();
  const schema = useSchema(t);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [errorDes, setDes] = useState<string | undefined>(undefined);

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      const request = {
        phone: new PhoneNumber(84, values.phone),
        password: values.password,
        name: values.name,
        gender: values.gender,
        birthday: values.birthday,
      };
      try {
        await auth.signUp(request);
      } catch (e) {
        console.log(e);
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
          variant="standard"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon="mobile-screen" />
                <select className=" border-none ml-4 text-base">
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
          type="password"
          variant="standard"
          fullWidth
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
        <TextField
          variant="standard"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon="user" />
              </InputAdornment>
            ),
          }}
          placeholder={t("fields.name", { ns: "account" })}
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
        />
        <FormGroup>
          <FormLabel>{t("fields.birthday", { ns: "account" })}</FormLabel>
          <BirthdayPicker date={formik.values.birthday} onChange={(date) => formik.setFieldValue("birthday", date)} />
        </FormGroup>
        <FormControl fullWidth>
          <FormLabel>{t("gender.gender")}</FormLabel>
          <RadioGroup
            row
            name="gender"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gender}
          >
            <FormControlLabel value={Gender.Male} control={<Radio />} label={t("gender.male")} />
            <FormControlLabel value={Gender.Female} control={<Radio />} label={t("gender.female")} />
          </RadioGroup>
        </FormControl>
        {errorDes && <em className="error">{errorDes}</em>}
        <Button
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {t("sign-up.btns.sign-up", { ns: "account" })}
        </Button>
      </form>
      <ApiErrorAlert error={error} onClose={({ description }) => setDes(description)} />
    </>
  );
}
