import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { AppDispatch, RootState } from "../store";
import { sendFriendRequest } from "../thunks/friendThunk";
import FormDialog from "../components/FormDialog";

const useSchema = (t: TFunction) =>
  yup.object().shape({
    title: yup.string().required(t("add-friend-dialog.fields.required-title", { ns: "views" })),
    description: yup.string().required(t("add-friend-dialog.fields.required-description", { ns: "views" })),
  });

export default function AddFriendDialog({
  friendId,
  open,
  onClose,
}: {
  open: boolean;
  friendId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const name = useSelector<RootState>((state) => state.auth.name);
  const dispatch = useDispatch<AppDispatch>();
  const schema = useSchema(t);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: t("add-friend-dialog.fields.default-title", {
        ns: "views",
      }) as string,
      description: t("add-friend-dialog.fields.default-description", {
        ns: "views",
        name,
      }) as string,
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!friendId) return;
      const request = {
        ...values,
        friendId,
      };
      await dispatch(sendFriendRequest(request));
      onClose();
    },
  });

  return (
    <FormDialog
      open={Boolean(friendId) && open}
      title={t("add-friend-dialog.title", { ns: "views" })}
      okText={t("btns.send")}
      isValid={formik.isValid}
      isSubmitting={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
    >
      <Typography>{t("add-friend-dialog.text", { ns: "views" })}</Typography>
      <FormControl fullWidth margin="normal">
        <FormLabel required>{t("add-friend-dialog.fields.title", { ns: "views" })}</FormLabel>
        <TextField
          fullWidth
          hiddenLabel
          placeholder={t("add-friend-dialog.fields.title", {
            ns: "views",
          })}
          size="small"
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          error={formik.touched.title && !!formik.errors.title}
          helperText={formik.touched.title && formik.errors.title}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel required>{t("add-friend-dialog.fields.description", { ns: "views" })}</FormLabel>
        <TextField
          fullWidth
          hiddenLabel
          placeholder={t("add-friend-dialog.fields.description", {
            ns: "views",
          })}
          size="small"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          error={formik.touched.description && !!formik.errors.description}
          helperText={formik.touched.description && formik.errors.description}
        />
      </FormControl>
    </FormDialog>
  );
}
