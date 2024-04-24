import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, InputAdornment, Stack, TextField } from "@mui/material";
import ActiveComponent from "../../components/ActiveComponent";

export default function ContactSearch() {
  const { t } = useTranslation();
  const [text, changeText] = useState("");
  const inputRef = useRef<{ focus: () => void }>();

  const handleClear = () => {
    changeText("");
    inputRef.current?.focus();
  };

  const inputProps = {
    className: "rounded-full",
    startAdornment: (
      <InputAdornment position="start" disablePointerEvents>
        <FontAwesomeIcon icon="magnifying-glass" />
      </InputAdornment>
    ),
    endAdornment: (
      <ActiveComponent condition={text}>
        <InputAdornment position="end" onClick={handleClear}>
          <FontAwesomeIcon className="text-red-500 cursor-pointer" icon="circle-xmark" />
        </InputAdornment>
      </ActiveComponent>
    ),
  };

  return (
    <Stack
      className="h-16 min-h-16 relative overflow-visible px-4"
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={1}
    >
      <Box maxWidth="400px" flex="1 1 auto">
        <TextField
          size="small"
          fullWidth
          hiddenLabel
          color="primary"
          variant="outlined"
          id="Contact-Search"
          InputProps={inputProps}
          inputRef={inputRef}
          value={text}
          onChange={(e) => changeText(e.target.value)}
          placeholder={t("search-input.placeholder", { ns: "layouts" })}
        />
      </Box>
    </Stack>
  );
}
