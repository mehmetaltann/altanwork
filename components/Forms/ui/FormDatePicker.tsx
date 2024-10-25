import { useField } from "formik";
import { TextField, TextFieldProps } from "@mui/material";

interface FormDatePickerProps {
  name: string;
}

const FormDatePicker: React.FC<FormDatePickerProps & TextFieldProps> = ({
  name,
  ...otherProps
}) => {
  const [field, meta] = useField(name);

  const configTextField: TextFieldProps = {
    type: "date",
    InputLabelProps: {
      shrink: true,
    },
    ...field,
    ...otherProps,
  };

  if (meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <TextField {...configTextField} />;
};

export default FormDatePicker;
