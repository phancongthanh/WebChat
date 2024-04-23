import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { SystemInfo } from "../../../types/SystemInfo";
import FileUtils from "../../../utils/file-utils";
import { RootState } from "../../../store";
import SquareIcon from "../../../components/SquareIcon";

export default function FileItem({ file, onDelete }: { file: File; onDelete?: () => void }) {
  const { t } = useTranslation();
  const { maxFileSize } = useSelector<RootState, SystemInfo>((state) => state.system);
  const fileSize = file.size / 1024 / 1024;

  return (
    <ListItem
      key={file.name}
      disablePadding
      secondaryAction={
        <IconButton color="error" disabled={!onDelete} onClick={onDelete}>
          <SquareIcon className="text-xs">
            <FontAwesomeIcon icon="x" />
          </SquareIcon>
        </IconButton>
      }
    >
      <ListItemButton
        className="rounded-lg"
        sx={{ color: fileSize > maxFileSize ? "error.main" : undefined }}
        title={fileSize > maxFileSize ? t("chat-bar.too-large-size", { ns: "views" }) : undefined}
        onClick={() => FileUtils.downloadFile(file.name, file)}
      >
        <ListItemIcon className="min-w-max mr-4">
          <SquareIcon className="text-xl">
            <FontAwesomeIcon icon={["far", "file"]} />
          </SquareIcon>
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap text-ellipsis overflow-hidden">{file.name}</Typography>
        </ListItemText>
        <ListItemText className="max-w-24 min-w-24 text-right">
          <Typography>{Math.round(fileSize * 1000) / 1000 + "MB"}</Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
