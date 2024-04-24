import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, FormControl, FormGroup, FormLabel, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import backgroundAvatar from "../assets/images/background-avatar.jpg";
import cameraIcon from "../assets/images/chat_setting_avatar_icon_edit.png";
import CurrentUser from "../types/CurrentUser";
import { avatarsClient, usersClient } from "../backend";
import { AppDispatch, RootState } from "../store";
import { showError } from "../store/errorSlice";
import Alert from "../components/Alert";
import BirthdayPicker from "../components/BirthdayPicker";
import FormDialog from "../components/FormDialog";
import GenderPicker from "../components/GenderPicker";
import UserAvatar from "../components/avatar/UserAvatar";

const avatarBackgroundStyle: React.CSSProperties = {
  margin: "-16px -24px 0 -24px",
  width: "420px",
  height: "180px",
  objectFit: "cover",
};

const useSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("update-info-dialog.fields.required-name", { ns: "components" }))
      .matches(/^[a-zA-Z\s,.'\-\p{L}]+$/u, t("update-info-dialog.fields.invalid-name", { ns: "components" })),
  });

export default function UpdateInfoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [modal, setModal] = useState<"Reload" | null>(null);
  const user = useSelector<RootState, CurrentUser>((state) => state.auth);
  const schema = useSchema(t);

  const formik = useFormik({
    initialValues: {
      avatar: null as File | null,
      name: user.name,
      gender: user.gender,
      birthday: user.birthday,
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (values.name !== user.name || values.gender !== user.gender || values.birthday !== user.birthday)
          await usersClient.update({
            userId: user.userId,
            name: values.name,
            gender: values.gender,
            birthday: values.birthday,
          });
        if (values.avatar) await avatarsClient.setUser(values.avatar);
        setModal("Reload");
      } catch (e) {
        dispatch(showError(e));
      }
    },
  });
  return (
    <FormDialog
      open={open}
      title={t("update-info-dialog.title", { ns: "components" })}
      isSubmitting={formik.isSubmitting}
      okText={t("btns.update")}
      okBtnProps={{ disabled: !formik.isValid || !formik.dirty }}
      onClose={onClose}
      onSubmit={formik.handleSubmit}
    >
      <Stack alignItems="center" gap={1}>
        <img style={avatarBackgroundStyle} src={backgroundAvatar} alt="Background" />
        <Box
          component="label"
          position="relative"
          marginTop="-65px"
          sx={{ cursor: "pointer" }}
          title={t("update-info-dialog.change-avatar", { ns: "components" })}
        >
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            multiple={false}
            name="avatar"
            onChange={(e) => e.currentTarget.files && formik.setFieldValue("avatar", e.currentTarget.files[0])}
          />
          {formik.values.avatar ? (
            <Avatar className="w-24 h-24" src={URL.createObjectURL(formik.values.avatar)} />
          ) : (
            <UserAvatar userId={user.userId} size={96} />
          )}
          <img className="absolute right-0 bottom-0 w-7 h-7" src={cameraIcon} alt="Camera Icon" />
        </Box>
        <FormControl fullWidth>
          <FormLabel>
            {t("update-info-dialog.fields.display-name", {
              ns: "components",
            })}
          </FormLabel>
          <TextField
            size="small"
            variant="outlined"
            fullWidth
            placeholder={user.name}
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Typography variant="caption">
            {t("update-info-dialog.name-recommend", {
              ns: "components",
            })}
          </Typography>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>
            {t("update-info-dialog.fields.phone-number", {
              ns: "components",
            })}
          </FormLabel>
          <TextField size="small" type="text" defaultValue={user.phone.toString()} disabled />
        </FormControl>
        <FormGroup className="w-full">
          <FormLabel>{t("update-info-dialog.fields.birthday", { ns: "components" })}</FormLabel>
          <BirthdayPicker date={formik.values.birthday} onChange={(date) => formik.setFieldValue("birthday", date)} />
        </FormGroup>
        <FormControl fullWidth>
          <FormLabel>{t("update-info-dialog.fields.gender", { ns: "components" })}</FormLabel>
          <GenderPicker gender={formik.values.gender} onChange={(gender) => formik.setFieldValue("gender", gender)} />
        </FormControl>
      </Stack>
      <Alert
        open={modal === "Reload"}
        title={t("update-info-dialog.alert.title", { ns: "components" })}
        btnText={t("btns.reload")}
        btnClick={() => window.location.reload()}
      >
        {t("update-info-dialog.alert.updated-data-successfully", { ns: "components" })}
      </Alert>
    </FormDialog>
  );
}
