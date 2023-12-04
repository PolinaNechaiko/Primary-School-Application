// This file is for reusable, universal validations

export const required = {
    required: {
        value: true,
        message: 'Required',
    },
};

export const nameRequired = {
    required: {
        value: true,
        message: 'Required',
    },
    validate: {
        minLenght: (value: string) => {
            const isTwo = value.trim().length >= 2;
            return isTwo || 'Min. 2 letters';
        },
        latinSymbols: (value: string) => {
            const isLatin = /^[A-Za-z ]*$/.test(value); // Only latin symbols and spaces
            return isLatin || 'Only Latin letters allowed';
        },
    },
};

export const mask10DigitPhoneRequired = {
    validate: {
        required: (value: string) => {
            const onlyDigitsStr = value.replace(/[^0-9]/g, ''); // any not-digit symbols => remove
            return !!onlyDigitsStr || 'Required';
        },
        tenDigits: (value: string) => {
            const is10Digits = /^(?:\D*\d){10}\D*$/.test(value); // 10 digits with any other symbols
            return (
                is10Digits || 'Phone must be 10 characters long'
            );
        },
    },
};
