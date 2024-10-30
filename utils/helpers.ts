import moment from "moment";

const DEFAULT_DATE_FORMAT = "DD.MM.YYYY";

export const dateFormat = (date: string, format: string = DEFAULT_DATE_FORMAT): string => {
  const momentDate = moment(date);

  if (!momentDate.isValid()) {
    return "Invalid Date";
  }

  return momentDate.format(format);
};

export const dateFormatNormal = (date: string): string => {
  const momentDate = moment(date);

  if (!momentDate.isValid()) {
    return "Invalid Date";
  }

  return momentDate.format();
};
