import { Select, styled } from '@mui/material';

export const CustomSelect = styled(Select)(
  ({ size, theme }) => ({
    'label + &': {
      marginTop: '0.15rem',
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 6,
      position: 'relative',
      backgroundColor:
        theme.palette.mode === 'light'
          ? 'white'
          : '#1A2027',
      fontSize: '0.9rem',
      width: '100%',
      padding: '0 12px',
      height:
        size === 'small'
          ? '32px !important'
          : '40px !important',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      '&::placeholder': {
        color: '#7C99B6',
        opacity: 1,
        fontSize: '0.875rem',
      },
      '& .MuiInputBase-multiline': {
        padding: 0,
      },
    },
  }),
);
