package com.example.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendSimpleEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Mã OTP xác thực tài khoản";
        String content = buildOtpEmailTemplate(otp);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email OTP", e);
        }
    }

    private String buildOtpEmailTemplate(String otp) {
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Mã OTP xác thực</title>
                </head>
                <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
                    <div style="max-width:600px;margin:0 auto;padding:24px;">
                        <div style="background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
                            <div style="text-align:center;margin-bottom:24px;">
                                <div style="display:inline-block;padding:10px 16px;border-radius:999px;background:#e8f1ff;color:#2563eb;font-weight:700;letter-spacing:0.5px;">
                                    Social Management
                                </div>
                            </div>

                            <h2 style="margin:0 0 12px;color:#0f172a;font-size:24px;line-height:1.4;text-align:center;">
                                Mã OTP xác thực của bạn
                            </h2>

                            <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.8;text-align:center;">
                                Bạn vừa yêu cầu mã OTP để xác thực tài khoản. Vui lòng sử dụng mã bên dưới trong vòng 5 phút.
                            </p>

                            <div style="margin:0 auto 24px;max-width:280px;background:linear-gradient(135deg,#2563eb,#4f46e5);padding:22px;border-radius:18px;text-align:center;">
                                <div style="color:#e0e7ff;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">
                                    Mã OTP
                                </div>
                                <div style="color:#ffffff;font-size:36px;font-weight:800;letter-spacing:8px;">
                                    """ + otp + """
                                </div>
                            </div>

                            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px 18px;color:#334155;font-size:14px;line-height:1.7;">
                                <strong>Lưu ý:</strong>
                                <ul style="margin:8px 0 0 18px;padding:0;">
                                    <li>Không chia sẻ mã OTP với bất kỳ ai.</li>
                                    <li>Mã sẽ hết hạn sau 5 phút.</li>
                                    <li>Nếu bạn không yêu cầu mã này, hãy bỏ qua email.</li>
                                </ul>
                            </div>

                            <p style="margin:24px 0 0;color:#64748b;font-size:13px;text-align:center;">
                                Email này được gửi tự động, vui lòng không trả lời.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }
}