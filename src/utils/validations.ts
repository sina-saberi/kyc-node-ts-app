import { z } from 'zod';

export const persianPhone = z
    .string()
    .regex(/^09\d{9}$/, 'شماره موبایل نامعتبر است');

export const iranNationalCode = z
    .string()
    .length(10, 'کد ملی باید 10 رقم باشد')
    .refine((code) => {
        if (!/^\d{10}$/.test(code)) return false;

        const check = +code[9];
        const sum = code
            .split('')
            .slice(0, 9)
            .reduce((acc, digit, i) => acc + +digit * (10 - i), 0);
        const remainder = sum % 11;

        return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
    }, {
        message: 'کد ملی نامعتبر است',
    });