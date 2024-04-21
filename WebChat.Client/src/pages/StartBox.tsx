import { useEffect, useState } from "react";
import { Translation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Stack, SxProps, Typography } from "@mui/material";
import startBoxImg0 from "../assets/images/start-box-images/StartBox-img-0.png";
import startBoxImg1 from "../assets/images/start-box-images/StartBox-img-1.png";
import startBoxImg2 from "../assets/images/start-box-images/StartBox-img-2.jpg";
import startBoxImg3 from "../assets/images/start-box-images/StartBox-img-3.jpg";
import startBoxImg4 from "../assets/images/start-box-images/StartBox-img-4.png";
import startBoxImg5 from "../assets/images/start-box-images/StartBox-img-5.jpg";
import startBoxImg6 from "../assets/images/start-box-images/StartBox-img-6.jpg";
import SquareIcon from "../components/SquareIcon";

const style: SxProps = {
  display: { xs: "none", md: "flex" },
};

const data = [
  {
    img: startBoxImg0,
    title: <Translation>{(t) => t("start-box.0.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.0.description", { ns: "pages" })}</Translation>,
  },
  {
    img: startBoxImg1,
    title: <Translation>{(t) => t("start-box.1.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.1.description", { ns: "pages" })}</Translation>,
  },
  {
    img: startBoxImg2,
    title: <Translation>{(t) => t("start-box.2.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.2.description", { ns: "pages" })}</Translation>,
  },
  {
    img: startBoxImg3,
    title: <Translation>{(t) => t("start-box.3.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.3.description", { ns: "pages" })}</Translation>,
  },
  {
    img: startBoxImg4,
    title: <Translation>{(t) => t("start-box.4.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.4.description", { ns: "pages" })}</Translation>,
  },
  {
    img: startBoxImg5,
    title: <Translation>{(t) => t("start-box.5.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.5.description", { ns: "pages" })}</Translation>,
  },
  {
    img: startBoxImg6,
    title: <Translation>{(t) => t("start-box.6.title", { ns: "pages" })}</Translation>,
    description: <Translation>{(t) => t("start-box.6.description", { ns: "pages" })}</Translation>,
  },
];

export default function StartBox() {
  const [slidePage, changeSlideShow] = useState(0);

  useEffect(() => {
    const loop = setTimeout(() => changeSlideShow((slidePage + 1) % data.length), 3000);
    return () => clearTimeout(loop);
  }, [slidePage, changeSlideShow]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={style}
      className="start-box overflow-hidden relative flex-1"
      gap={2}
    >
      <Box className="w-96 text-center">
        <Box className="text-2xl mb-5">
          <Translation>{(t) => t("start-box.title", { ns: "pages" })}</Translation>
          <Typography className="inline-block text-2xl font-semibold">WebChat</Typography>!
        </Box>
        <Box className="text-sm text-center">
          <Translation>{(t) => t("start-box.description", { ns: "pages" })}</Translation>
        </Box>
      </Box>
      <Box className="w-full relative">
        <Box className="relative w-full h-full">
          <Stack
            direction="row"
            sx={{ width: "calc(" + data.length + "00%)", left: "-" + slidePage + "00%" }}
            className="slideshow-content relative h-full transition-all duration-300"
          >
            {data.map((value, index) => (
              <Box key={index} className="text-center flex-1">
                <img className="w-96 object-contain" src={value.img} alt="Img error!" />
                <Typography color="primary.main" className="font-bold text-lg mx-8 mt-7 mb-1">
                  {value.title}
                </Typography>
                <Typography className="text-sm mx-8">{value.description}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
        <IconButton
          className="absolute text-neutral-700 top-1/2 left-3"
          onClick={() => changeSlideShow((slidePage + data.length - 1) % data.length)}
        >
          <SquareIcon className="w-6 h-6">
            <FontAwesomeIcon icon="chevron-left" />
          </SquareIcon>
        </IconButton>
        <IconButton
          className="absolute text-neutral-700 top-1/2 right-3"
          onClick={() => changeSlideShow((slidePage + 1) % data.length)}
        >
          <SquareIcon className="w-6 h-6">
            <FontAwesomeIcon icon="chevron-right" />
          </SquareIcon>
        </IconButton>
      </Box>
      <Stack direction="row" gap={2}>
        {[0, 1, 2, 3, 4, 5, 6].map((value) => (
          <Box
            key={value}
            className="w-2 h-2 rounded-full cursor-pointer"
            sx={{ backgroundColor: slidePage === value ? "primary.main" : "secondary.main" }}
            onClick={() => changeSlideShow(value)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
