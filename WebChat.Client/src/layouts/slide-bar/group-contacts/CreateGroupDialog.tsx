import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import * as yup from "yup";
import { AppDispatch } from "../../../store";
import useFriends from "../../../hooks/useFriends";
import { createGroup } from "../../../thunks/groupThunk";
import FormDialog from "../../../components/FormDialog";
import UserAvatar from "../../../components/avatar/UserAvatar";
import NotEnoughFriends from "./NotEnoughFriend";

const useSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("group-contacts.create.required-name", { ns: "layouts" }))
      .matches(/^[a-zA-Z\s,.'\-\p{L}]+$/u, t("group-contacts.create.invalid-name", { ns: "layouts" })),
    userIds: yup.array().min(2),
  });

export default function CreateGroupDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const schema = useSchema(t);
  const friends = useFriends();
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      name: "",
      userIds: [],
    },
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      console.log(values);
      const groupId = await dispatch(createGroup(values)).unwrap();
      if (groupId) {
        navigate("/Group/" + groupId);
        onClose();
      }
    },
  });

  if (friends.length < 2) return <NotEnoughFriends open={open} onClose={onClose} />;

  return (
    <FormDialog
      open={open}
      title={t("group-contacts.create.title", { ns: "layouts" })}
      okText={t("btns.create-group")}
      isValid={formik.isValid}
      isSubmitting={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      onClose={onClose}
    >
      <Stack className="w-80" gap={3}>
        <FormControl fullWidth>
          <FormLabel className="mb-2">
            {t("group-contacts.create.name-recommend", {
              ns: "layouts",
            })}
          </FormLabel>
          <TextField
            size="small"
            variant="outlined"
            fullWidth
            placeholder={t("group-contacts.create.name", {
              ns: "layouts",
            })}
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
        </FormControl>
        <FormGroup>
          <FormLabel>
            {t("group-contacts.create.userIds", {
              ns: "layouts",
            })}
          </FormLabel>
          <List className="relative overflow-auto max-h-80 normal-scroll-bar">
            {friends.map((friend) => (
              <FormLabel key={friend.userId}>
                <ListItem
                  className="hover:bg-neutral-100 rounded cursor-pointer"
                  secondaryAction={<Checkbox name="userIds" value={friend.userId} onChange={formik.handleChange} />}
                >
                  <ListItemAvatar>
                    <UserAvatar userId={friend.userId} size={40} />
                  </ListItemAvatar>
                  <ListItemText>{friend.alias || friend.name}</ListItemText>
                </ListItem>
              </FormLabel>
            ))}
          </List>
        </FormGroup>
      </Stack>
    </FormDialog>
  );
}
