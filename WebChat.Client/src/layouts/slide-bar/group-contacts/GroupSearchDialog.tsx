import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { storage } from "../../../utils/storage-management";
import { groupsClient } from "../../../backend";
import { AppDispatch } from "../../../store";
import { showError } from "../../../store/errorSlice";
import useGlobalElement from "../../../hooks/useGlobalElement";
import FormDialog from "../../../components/FormDialog";
import SearchHistory from "./SearchHistory";

const setHistory = (groupIds: string[]): void => storage.set("group-search-history", JSON.stringify(groupIds));
const getHistory = () => {
  const history = storage.get("group-search-history");
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
    code: yup
      .string()
      .required(t("group-contacts.search.required-code", { ns: "layout" }))
      .matches(/^[A-Z0-9a-z]{4,10}$/, t("group-contacts.search.invalid-code", { ns: "layout" })),
  });

export default function GroupSearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const schema = useSchema(t);
  const { showGroupProfile } = useGlobalElement();
  const [groupIds, setGroupIds] = useState<string[]>(getHistory());
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => setHistory(groupIds), [groupIds]);

  const openProfile = (groupId: string) => showGroupProfile(groupId);

  const onDelete = useCallback((groupId: string) => setGroupIds(groupIds.filter((id) => id !== groupId)), [groupIds]);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const group = await groupsClient.getByCode(values.code);
        if (group) {
          const groupId = group.groupId;
          setGroupIds([groupId, ...groupIds.filter((i) => i !== groupId)]);
          openProfile(groupId);
        }
      } catch (e) {
        dispatch(showError(e));
      }
    },
  });

  return (
    <FormDialog
      open={open}
      title={t("group-contacts.search.title", { ns: "layout" })}
      okText={t("btns.search")}
      isValid={formik.isValid}
      isSubmitting={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
    >
      <TextField
        className="w-60"
        variant="standard"
        autoFocus
        name="code"
        value={formik.values.code}
        onChange={formik.handleChange}
        placeholder={t("group-contacts.search.code", {
          ns: "layout",
        })}
        title={t("group-contacts.search.placeholder", {
          ns: "layout",
        })}
      />
      <Box textAlign="center" margin="20px auto" minHeight="50px">
        <SearchHistory groupIds={groupIds} openProfile={openProfile} onDelete={onDelete} />
      </Box>
    </FormDialog>
  );
}
