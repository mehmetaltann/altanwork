import React from 'react';
import { TextField, MenuItem } from "@mui/material";

interface AltanSelectProps {
  id: string;
  variant?: "standard" | "outlined" | "filled";
  children?: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
  size?: "small" | "medium";
  sxProps?: React.CSSProperties;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  minWidth?: string;
  defaultValue?: string;
  data: Array<Record<string, any>>;
  dataTextAttr: string;
  dataValueAttr: string;
  isAll?: boolean;
}

const AltanSelect: React.FC<AltanSelectProps> = ({
  id,
  variant = "standard",
  onChange,
  value,
  size = "small",
  sxProps = {},
  color = "info",
  minWidth = "20ch",
  defaultValue,
  data = [],
  dataTextAttr,
  dataValueAttr,
  isAll = false,
  ...rest
}) => {
  return (
    <TextField
      select
      id={id}
      defaultValue={defaultValue}
      variant={variant}
      value={value}
      size={size} // This will now only accept "small" or "medium"
      color={color}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        minWidth,
        p: 1,
        ...sxProps,
      }}
      {...rest}
    >
      {isAll && (
        <MenuItem value="Tümü" sx={{ fontWeight: 400 }}>
          Tümü
        </MenuItem>
      )}
      {data.length > 0 ? (
        data.map((option) => (
          <MenuItem
            key={option[dataValueAttr]}
            value={option[dataValueAttr]}
            sx={{ fontWeight: 400 }}
          >
            {option[dataTextAttr]}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No options available</MenuItem>
      )}
    </TextField>
  );
};

export default AltanSelect;
