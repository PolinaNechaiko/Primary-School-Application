import {Box, colors, InputBaseProps, InputLabel, SxProps, Theme, Typography} from "@mui/material";
import {FormInput} from "../FormInput/FormInput.tsx";

interface FormTextFieldProps {
    label: string;
    inputProps: InputBaseProps & { mask?: string };
    helperText?: string;
    sx?: SxProps<Theme>;
}
export const FormTextField = ({
                           label,
                           inputProps,
                           helperText,
                           sx = [],
                       }: FormTextFieldProps) => {
    return (
        <Box className="form-input" sx={sx}>
            {label && (
                <InputLabel
                    htmlFor={inputProps.id}
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: 400,
                        color: '#32485F',
                        backgroundColor:"white",
                        width:"fit-content"
                    }}
                    className="form-input__label"
                >
                    {label}
                </InputLabel>
            )}
            <FormInput {...inputProps} />
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