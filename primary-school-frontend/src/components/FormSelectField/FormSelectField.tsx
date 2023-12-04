import {
  Box,
  colors,
  InputLabel,
  MenuItem,
  MenuProps,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { SelectProps } from '@mui/material/Select/Select';
import { CustomSelect } from './FormSelectField.style';
import { ReactNode } from 'react';

interface FormSelectFieldProps {
  label?: string | ReactNode;
  selectProps: SelectProps;
  helperText?: string;
  sx?: SxProps<Theme>;
  items?: {
    value: string | number;
    label: JSX.Element | string;
  }[];
  MenuProps?: Partial<MenuProps>;
}

const FormSelectField = ({
  label,
  selectProps,
  helperText,
  sx = [],
  items = [{ value: '', label: 'Add Items' }],
  MenuProps,
}: FormSelectFieldProps) => {
  sx = Array.isArray(sx) ? sx : [sx];

  return (
    <Box className="form-select" sx={sx}>
      {label && (
        <InputLabel
          htmlFor={selectProps.id}
          sx={{
            fontSize: '0.75rem',
            fontWeight: 400,
            color: '#32485F',
          }}
          className="form-input__label"
        >
          {label}
        </InputLabel>
      )}
      <CustomSelect MenuProps={MenuProps} {...selectProps}>
        {items?.map(({ value, label }, index) => {
          return (
            <MenuItem value={value} key={index}>
              {label}
            </MenuItem>
          );
        })}
      </CustomSelect>
      {helperText !== 'hidden' && (
        <Typography
          color={colors.red[400]}
          fontSize="0.7rem"
          sx={{ mt: '0.05rem', height: '1rem' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FormSelectField;
