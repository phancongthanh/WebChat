import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { AppDispatch } from "../store";
import useGroup from "../hooks/useGroup";
import { updateGroupName } from "../thunks/groupThunk";
import FormDialog from "../components/FormDialog";
import GroupAvatar from "../components/avatar/GroupAvatar";

const useSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("update-group-name-dialog.required-name", { ns: "views" }))
      .matches(/^[a-zA-Z\s,.'\-\p{L}]+$/u, t("update-group-name-dialog.invalid-name", { ns: "views" })),
  });

export default function UpdateGroupNameDialog({
  groupId,
  open,
  onClose,
}: {
  open: boolean;
  groupId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const schema = useSchema(t);
  const group = useGroup(groupId as string);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: group?.name || "",
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!groupId) return;
      await dispatch(updateGroupName({ groupId, name: values.name }));
      onClose();
    },
  });
  return (
    <FormDialog
      open={open}
      title={t("update-group-name-dialog.title", { ns: "views" })}
      isValid={formik.isValid && formik.dirty}
      isSubmitting={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
    >
      <Stack direction="column" alignItems="center" gap={2}>
        {groupId && <GroupAvatar groupId={groupId} size={72} />}
        <Box className="text-center">
          <Typography>
            {t("update-group-name-dialog.description.first", {
              ns: "views",
            })}
            <b>{group?.name}</b>
            {t("update-group-name-dialog.description.last", {
              ns: "views",
            })}
          </Typography>
          <Typography>{t("update-group-name-dialog.notice", { ns: "views" })}</Typography>
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t("update-group-name-dialog.name", {
            ns: "views",
          })}
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
        />
      </Stack>
    </FormDialog>
  );
}
