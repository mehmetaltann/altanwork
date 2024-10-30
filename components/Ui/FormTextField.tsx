import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

type FormTextFieldProps = TextFieldProps & {
  name: string;
};

const FormTextField: React.FC<FormTextFieldProps> = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    error: Boolean(meta && meta.touched && meta.error),
    helperText: meta && meta.touched && meta.error ? meta.error : undefined,
  };

  return <TextField {...configTextField} />;
};

export default FormTextField;
