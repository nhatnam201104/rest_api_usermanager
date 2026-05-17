import { z } from 'zod';

/**
 * Vietnamese phone number regex — mirrors backend PhoneValidator:
 *  - 10 digits starting with 0 + valid mobile prefix
 *  - 12 chars starting with +84 + valid mobile prefix
 *  - 11 chars starting with 84 + valid mobile prefix
 */
const VIETNAM_PHONE_REGEX =
  /^(0(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}|(\+84|84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9])\d{7})$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Họ tên không được để trống')
      .min(3, 'Họ tên phải có ít nhất 3 ký tự')
      .max(100, 'Họ tên không được vượt quá 100 ký tự'),
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ'),
    phone: z
      .string()
      .min(1, 'Số điện thoại không được để trống')
      .regex(VIETNAM_PHONE_REGEX, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
    password: z
      .string()
      .min(1, 'Mật khẩu không được để trống')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(20, 'Mật khẩu không được vượt quá 20 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
