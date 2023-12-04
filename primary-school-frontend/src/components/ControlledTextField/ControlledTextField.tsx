import {Control, Controller, FieldPath, FieldValues, RegisterOptions,} from 'react-hook-form';
import {SxProps} from '@mui/material';
import {FormTextField} from '../FormTextField/FormTextField.tsx';
import {InputHTMLAttributes} from "react";

interface ControlledTextFieldProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
> {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions;
    label: string;
    placeholder?: string;
    autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    sx?: SxProps;
    inputProps?:any;
}

const ControlledTextField = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
>({
      name,
      control,
      rules,
      label,
      placeholder = 'Type here',
      autoComplete = 'off',
      sx = [],
                                  inputProps
  }: ControlledTextFieldProps<TFieldValues, TName>) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({
                     field: {name, onBlur, onChange, value, ref},
                     fieldState,
                 }) => (
            <FormTextField
                label={label}
                helperText={fieldState.error?.message || ''}
                inputProps={{
                    ...inputProps,
                    name,
                    id: name,
                    onBlur,
                    onChange,
                    value,
                    inputRef: ref,
                    placeholder,
                    autoComplete,
                    sx,
                }}
            />
        )}
    />
);

export {ControlledTextField};
