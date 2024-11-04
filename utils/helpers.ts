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
    // Check if the current value is different from the initial value
    if (initialValues[key] !== value) {
      // Type assertion to tell TypeScript that key is definitely a key of T
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};