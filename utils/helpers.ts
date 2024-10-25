import moment from "moment";

export const dateFormat = (date: string, format = "DD.MM.YYYY") => {
  const momentDate = moment(date);

  if (!momentDate.isValid()) {
    return "Invalid Date";
  }

  return momentDate.format(format);
};
