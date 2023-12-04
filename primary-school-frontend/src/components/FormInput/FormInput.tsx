import {alpha, InputBase, InputBaseProps, styled} from "@mui/material";

export const FormInput = styled((props: InputBaseProps) => (
    <InputBase {...props} />
))(({ theme, size }) => ({
    'label + &': {
        marginTop: '0.1rem',
    },
    '& .MuiInputBase-input': {
        borderRadius: 6,
        position: 'relative',
        backgroundColor: 'white',
        border: '1px solid',
        borderColor: '#BDCCDB',
        fontSize: '0.9rem',
        padding: '0 12px',
        boxSizing: 'border-box',
        height: size === 'small' ? '32px' : '42px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:focus': {
            boxShadow: `${alpha(
                theme.palette.primary.main,
                0.25,
            )} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
        '&::placeholder': {
            color: '#7C99B6',
            opacity: 1,
            fontSize: '0.875rem',
        },
    },
}));
