import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Box, FormControl, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { storage } from "../../../utils/storage-management";
import { usersClient } from "../../../backend";
import { AppDispatch } from "../../../store";
import { showError } from "../../../store/errorSlice";
import useGlobalElement from "../../../hooks/useGlobalElement";
import FormDialog from "../../../components/FormDialog";
import SearchHistory from "./SearchHistory";

const setHistory = (userIds: string[]): void => storage.set("friend-search-history", JSON.stringify(userIds));
const getHistory = () => {
  const history = storage.get("friend-search-history");
  if (history) {
    try {
      return JSON.parse(history);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  return [];
};

const useSchema = (t: TFunction) =>
  yup.object().shape({
    phone: yup
      .string()
      .required(t("friend-contacts.search.required-phone", { ns: "layouts" }))
      .matches(/^0[1-9][0-9]{6,14}$/, t("friend-contacts.search.invalid-phone", { ns: "layouts" })),
  });

export default function FriendSearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const schema = useSchema(t);
  const { showUserProfile } = useGlobalElement();
  const [userIds, setUserIds] = useState<string[]>(getHistory());
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => setHistory(userIds), [userIds]);

  const openProfile = (userId: string) => showUserProfile(userId);

  const onDelete = useCallback((userId: string) => setUserIds(userIds.filter((id) => id !== userId)), [userIds]);

  const formik = useFormik({
    initialValues: {
      country: "84",
      phone: "",
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const user = await usersClient.getByPhone(values.country, values.phone);
        if (user) {
          const userId = user.userId;
          setUserIds([userId, ...userIds.filter((i) => i !== userId)]);
          openProfile(userId);
        }
      } catch (e) {
        dispatch(showError(e));
      }
    },
  });

  return (
    <FormDialog
      open={open}
      title={t("friend-contacts.search.title", { ns: "layouts" })}
      okText={t("btns.search")}
      isValid={formik.isValid}
      isSubmitting={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
    >
      <Box>
        <Stack direction="row" marginBottom="20px" gap={2}>
          <FormControl variant="standard">
            <Select value={+84}>
              <MenuItem value={+84}>Việt Nam (+84)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="standard"
            autoFocus
            value={formik.values.phone}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) formik.setFieldValue("phone", e.target.value);
            }}
            placeholder={t("phone.number", { ns: "common" })}
            title={t("friend-contacts.search.placeholder", {
              ns: "layouts",
            })}
          />
        </Stack>
        <Box textAlign="center" margin="20px auto" minHeight="50px">
          <SearchHistory userIds={userIds} openProfile={openProfile} onDelete={onDelete} />
        </Box>
      </Box>
    </FormDialog>
  );
}
