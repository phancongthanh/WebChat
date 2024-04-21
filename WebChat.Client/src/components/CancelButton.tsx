import { useTranslation } from "react-i18next";
import { LoadingButtonProps } from "@mui/lab";
import AsyncButton from "./AsyncButton";

export default function CancelButton(props: LoadingButtonProps) {
  const { t } = useTranslation();
  return (
    <AsyncButton
      variant="outlined"
      className={"[&:not(:hover)]:text-neutral-700 [&:not(:hover)]:border-gray-300" + props.className}
      disableRipple
      {...props}
    >
      {props.children || t("btns.cancel")}
    </AsyncButton>
  );
}
