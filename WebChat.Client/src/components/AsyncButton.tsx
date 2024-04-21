import { useState } from "react";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

export default function AsyncButton({ loading, onClick, ...rest }: LoadingButtonProps) {
  const [isLoading, setLoading] = useState(false);
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;
    try {
      setLoading(true);
      await onClick(event);
    } finally {
      setLoading(false);
    }
  };
  return <LoadingButton {...rest} loading={loading || isLoading} onClick={handleClick} />;
}
