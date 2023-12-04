import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { SelectProps } from '@mui/material/Select/Select';
import { MenuProps } from '@mui/material/Menu';
import { SxProps, Theme } from '@mui/material';
import FormSelectField from '../FormSelectField';

interface ControlledSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  rules?: RegisterOptions;
  label: string;
  items?: {
    value: string | number;
    label: JSX.Element | string;
  }[];
  helperText?: string;
  selectProps?: SelectProps;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  MenuProps?: Partial<MenuProps>;
  sx?: SxProps<Theme>;
}

const ControlledSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  items,
  helperText,
  selectProps,
  onChange,
  onBlur,
  MenuProps,
  sx = [],
}: ControlledSelectProps<TFieldValues, TName>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormSelectField
          sx={sx}
          MenuProps={MenuProps}
          label={label}
          selectProps={{
            id: name,
            ...field,
            ...selectProps,
            onChange: (e) => {
              field.onChange(e);
              if (onChange) onChange(e.target.value);
            },
            onBlur: () => {
              field.onBlur();
              if (onBlur) onBlur();
            },
          }}
          helperText={
            fieldState.error?.message || helperText || ' '
          }
          items={items}
        />
      )}
    />
  );
};

export default ControlledSelect;
