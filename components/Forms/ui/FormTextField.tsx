import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

interface FormTextFieldProps {
  name: string;
}

const FormTextField: React.FC<FormTextFieldProps & TextFieldProps> = ({
  name,
  ...otherProps
}) => {
  const [field, meta] = useField(name);

  const configTextField: TextFieldProps = {
    ...field,
    ...otherProps,
    error: !!(meta.touched && meta.error),
    helperText: meta.touched && meta.error ? meta.error : undefined,
  };

  return <TextField {...configTextField} />;
};

export default FormTextField;
