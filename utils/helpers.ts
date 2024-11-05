import moment from "moment";

const DEFAULT_DATE_FORMAT = "DD.MM.YYYY";

export const dateFormat = (
  date: string | undefined,
  format: string = DEFAULT_DATE_FORMAT
): string => {
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

const dateNow = new Date();
const year = dateNow.getFullYear();
const month = (dateNow.getUTCMonth() + 1).toString().padStart(2, "0");
const date = dateNow.getUTCDate().toString().padStart(2, "0");

export const todayDateInput = `${year}-${month}-${date}`; // Formatted date string

export const getChangedValues = <T extends Record<string, any>>(
  values: T,
  initialValues: T
): Partial<T> => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (
      initialValues[key] !== value &&
      initialValues[key] !== "projeler" &&
      initialValues[key] !== "odemeler"
    ) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};
