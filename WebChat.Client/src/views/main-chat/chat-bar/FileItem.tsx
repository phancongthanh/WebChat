import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import FileUtils from "../../../utils/file-utils";
import SquareIcon from "../../../components/SquareIcon";

export default function FileItem({ file, onDelete }: { file: File; onDelete?: () => void }) {
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
      <ListItemButton className="rounded-lg" onClick={() => FileUtils.downloadFile(file.name, file)}>
        <ListItemIcon className="min-w-max mr-4">
          <SquareIcon className=" text-xl">
            <FontAwesomeIcon icon={["far", "file"]} />
          </SquareIcon>
        </ListItemIcon>
        <ListItemText>
          <Typography className="whitespace-nowrap text-ellipsis overflow-hidden">{file.name}</Typography>
        </ListItemText>
        <ListItemText className="max-w-max">
          <Typography>{Math.round((file.size / 1024 / 1024) * 1000) / 1000 + "MB"}</Typography>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
