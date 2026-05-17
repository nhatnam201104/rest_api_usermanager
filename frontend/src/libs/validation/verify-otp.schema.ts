import { z } from 'zod';

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(1, 'Mã OTP không được để trống')
    .length(6, 'Mã OTP phải đúng 6 ký tự')
    .regex(/^\d{6}$/, 'Mã OTP chỉ gồm 6 chữ số'),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
