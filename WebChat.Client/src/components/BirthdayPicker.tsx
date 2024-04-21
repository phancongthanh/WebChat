import { useCallback } from "react";
import { FormGroup, MenuItem, Select } from "@mui/material";

function getYearItems() {
  const today = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i <= 99; i++)
    yearOptions.push(
      <MenuItem key={i} value={today - i}>
        {today - i}
      </MenuItem>,
    );
  return yearOptions;
}

function getMonthItems() {
  const monthOptions = [];
  for (let i = 1; i <= 12; i++)
    monthOptions.push(
      <MenuItem key={i} value={i - 1}>
        {i >= 10 ? i : "0" + i}
      </MenuItem>,
    );
  return monthOptions;
}

function getDayItems(month: number, year: number) {
  const dayOptions = [];
  switch (month + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      for (let i = 1; i <= 31; i++)
        dayOptions.push(
          <MenuItem key={i} value={i}>
            {i >= 10 ? i : "0" + i}
          </MenuItem>,
        );
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      for (let i = 1; i <= 30; i++)
        dayOptions.push(
          <MenuItem key={i} value={i}>
            {i >= 10 ? i : "0" + i}
          </MenuItem>,
        );
      break;
    case 2:
      for (let i = 1; i <= (year % 4 === 0 ? 29 : 28); i++)
        dayOptions.push(
          <MenuItem key={i} value={i}>
            {i >= 10 ? i : "0" + i}
          </MenuItem>,
        );
      break;
  }
  return dayOptions;
}

const style = {
  justifyContent: "space-between",
};

export default function BirthdayPicker({ date, onChange }: { date: Date; onChange(date: Date): void }) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const setDay = useCallback(
    (day: number) => {
      const newDate = new Date(date);
      newDate.setDate(day);
      onChange(newDate);
    },
    [date, onChange],
  );

  const setMonth = useCallback(
    (month: number) => {
      const newDate = new Date(date);
      newDate.setMonth(month);
      onChange(newDate);
    },
    [date, onChange],
  );

  const setYear = useCallback(
    (year: number) => {
      const newDate = new Date(date);
      newDate.setFullYear(year);
      onChange(newDate);
    },
    [date, onChange],
  );

  return (
    <FormGroup row sx={style}>
      <Select sx={{ width: "28%" }} size="small" value={day} onChange={(e) => setDay(Number(e.target.value))}>
        {getDayItems(month, year)}
      </Select>
      <Select sx={{ width: "28%" }} size="small" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
        {getMonthItems()}
      </Select>
      <Select sx={{ width: "41%" }} size="small" value={year} onChange={(e) => setYear(Number(e.target.value))}>
        {getYearItems()}
      </Select>
    </FormGroup>
  );
}
