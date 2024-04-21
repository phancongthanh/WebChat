import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { AppDispatch } from "../store";
import useUser from "../hooks/useUser";
import { setFriendAlias } from "../thunks/friendThunk";
import CancelButton from "../components/CancelButton";
import FormDialog from "../components/FormDialog";
import UserAvatar from "../components/avatar/UserAvatar";

const useSchema = (t: TFunction) =>
  yup.object().shape({
    alias: yup
      .string()
      .required(t("set-alias-dialog.fields.required-alias", { ns: "views" }))
      .matches(/^[a-zA-Z\s,.'\-\p{L}]+$/u, t("set-alias-dialog.fields.invalid-alias", { ns: "views" })),
  });

export default function SetAliasDialog({
  friendId,
  open,
  onClose,
}: {
  open: boolean;
  friendId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const schema = useSchema(t);
  const friend = useUser(friendId as string);

  const formik = useFormik({
    initialValues: {
      alias: friend?.alias || null,
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!friendId) return;
      await dispatch(setFriendAlias({ friendId, alias: values.alias }));
      onClose();
    },
    onReset: async () => {
      if (!friendId) return;
      await dispatch(setFriendAlias({ friendId, alias: null }));
      onClose();
    },
  });
  return (
    <FormDialog
      open={open}
      title={t("set-alias-dialog.title", { ns: "views" })}
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
      onClose={onClose}
      btns={
        <>
          <Button variant="outlined" type="reset" disableRipple disabled={formik.isSubmitting || !friend?.alias}>
            {t("set-alias-dialog.btns.reset", { ns: "views" })}
          </Button>
          <Box flex={1} />
          <CancelButton onClick={onClose} />
          <Button
            type="submit"
            variant="contained"
            disableRipple
            disabled={!formik.isValid || formik.isSubmitting || formik.values.alias == friend?.alias}
          >
            {t("set-alias-dialog.btns.set", { ns: "views" })}
          </Button>
        </>
      }
    >
      <Stack direction="column" alignItems="center" gap={2}>
        {friendId && <UserAvatar userId={friendId} size={72} />}
        <Box className="text-center">
          <Typography>
            {t("set-alias-dialog.description.first", {
              ns: "views",
            })}
            <b>{friend?.name}</b>
            {t("set-alias-dialog.description.last", {
              ns: "views",
            })}
          </Typography>
          <Typography>{t("set-alias-dialog.notice", { ns: "views" })}</Typography>
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t("set-alias-dialog.fields.alias", {
            ns: "views",
          })}
          name="alias"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.alias || ""}
          error={formik.touched.alias && !!formik.errors.alias}
          helperText={formik.touched.alias && formik.errors.alias}
        />
      </Stack>
    </FormDialog>
  );
}
