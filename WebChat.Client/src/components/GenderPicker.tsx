import { useTranslation } from "react-i18next";
import { FormControlLabel, Radio, RadioGroup, SxProps } from "@mui/material";
import { Gender } from "../enums/Gender";

const style: SxProps = {
  "& .MuiFormControlLabel-root": {
    marginLeft: 0,
    flex: 1,
  },
  "& .MuiRadio-root": {
    padding: 0,
    marginRight: "9px",
  },
};

export default function GenderPicker({ gender, onChange }: { gender?: Gender; onChange: (gender: Gender) => void }) {
  const { t } = useTranslation();
  return (
    <RadioGroup row onChange={(_, value) => onChange(Number(value))} value={gender} sx={style}>
      <FormControlLabel value={Gender.Male} control={<Radio />} label={t("gender.male")} />
      <FormControlLabel value={Gender.Female} control={<Radio />} label={t("gender.female")} />
    </RadioGroup>
  );
}
