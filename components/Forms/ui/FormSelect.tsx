import { TextField, TextFieldProps } from "@mui/material";
import { FieldProps } from "formik";

interface FormSelectProps extends FieldProps {
  children: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps & TextFieldProps> = ({
  children,
  form,
  field,
  ...rest
}) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <TextField
      select
      type="text"
      sx={{ width: "100%" }}
      name={name}
      value={value ?? ""}
      onChange={(e) => {
        setFieldValue(name, e.target.value);
      }}
      size="small"
      {...rest}
    >
      {children}
    </TextField>
  );
};

export default FormSelect;
