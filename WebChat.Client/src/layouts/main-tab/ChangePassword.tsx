import { useTranslation } from "react-i18next";
import { FormControl, FormLabel, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import auth from "../../backend/auth";
import FormDialog from "../../components/FormDialog";

const useSchema = (t: TFunction) =>
  yup.object().shape({
    old: yup.string().required(t("password.required")),
    new: yup
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

export default function ChangePassword({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const schema = useSchema(t);

  const formik = useFormik({
    initialValues: {
      old: "",
      new: "",
      confirm: "",
    },
    validateOnMount: true,
    validationSchema: schema,
    validate(values) {
      if (values.new !== values.confirm)
        return {
          confirm: t("password.confirm"),
        };
    },
    onSubmit: async (values) => {
      await auth.changePassword(values.old, values.new);
      onClose();
    },
  });

  return (
    <FormDialog
      open={open}
      title={t("change-password.title", { ns: "layouts" })}
      isValid={formik.isValid}
      isSubmitting={formik.isSubmitting}
      onClose={onClose}
      onSubmit={formik.handleSubmit}
    >
      <Stack className="w-80 max-w-full" gap={2}>
        <FormControl fullWidth>
          <FormLabel>
            {t("change-password.old", {
              ns: "layouts",
            })}
          </FormLabel>
          <TextField
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            name="old"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.old}
            error={formik.touched.old && !!formik.errors.old}
            helperText={formik.touched.old && formik.errors.old}
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>
            {t("change-password.new", {
              ns: "layouts",
            })}
          </FormLabel>
          <TextField
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            name="new"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.new}
            error={formik.touched.new && !!formik.errors.new}
            helperText={formik.touched.new && formik.errors.new}
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>
            {t("change-password.confirm", {
              ns: "layouts",
            })}
          </FormLabel>
          <TextField
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            name="confirm"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirm}
            error={formik.touched.confirm && !!formik.errors.confirm}
            helperText={formik.touched.confirm && formik.errors.confirm}
          />
        </FormControl>
      </Stack>
    </FormDialog>
  );
}
