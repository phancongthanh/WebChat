import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { t } from "i18next";
import Modal from "../../../components/Modal";
import FriendSearchDialog from "../friend-contacts/FriendSearchDialog";

export default function NotEnoughFriends({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [friendSearch, openFriendSearch] = useState(false);

  if (friendSearch) return <FriendSearchDialog open={true} onClose={onClose} />;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("group-contacts.create.not-enough-friend", { ns: "layout" })}
      btns={[
        <Button key="cancel" variant="contained" color="secondary" disableRipple onClick={onClose}>
          {t("btns.cancel")}
        </Button>,
        <Button key="add-friend" variant="contained" disableRipple onClick={() => openFriendSearch(true)}>
          {t("btns.add-friend")}
        </Button>,
      ]}
    >
      <Box>
        <Typography>
          {t("group-contacts.create.not-enough", {
            ns: "layout",
          })}
        </Typography>
        <Typography>
          {t("group-contacts.create.should-add-friend", {
            ns: "layout",
          })}
        </Typography>
      </Box>
    </Modal>
  );
}
