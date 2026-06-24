import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly cfg: ConfigService) {
    const apiKey = this.cfg.getOrThrow<string>('RESEND_API_KEY');
    this.from = this.cfg.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';
    this.resend = new Resend(apiKey);
  }

  async sendPasswordReset(email: string, resetLink: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Hacé click en el botón para elegir una nueva. El link expira en 1 hora.</p>
        <p style="margin: 24px 0;">
          <a href="${resetLink}"
             style="background:#0d6efd;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">
            Restablecer contraseña
          </a>
        </p>
        <p style="color:#666;font-size:12px;">
          Si no solicitaste este cambio, podés ignorar este correo.
        </p>
      </div>
    `;

    await this.send(email, 'Recuperá tu contraseña', html);
  }

  async sendVerification(email: string, verifyLink: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Verificá tu email</h2>
        <p>Gracias por registrarte. Confirmá tu dirección haciendo click en el botón:</p>
        <p style="margin: 24px 0;">
          <a href="${verifyLink}"
             style="background:#0d6efd;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">
            Verificar email
          </a>
        </p>
        <p style="color:#666;font-size:12px;">
          Si no creaste esta cuenta, podés ignorar este correo.
        </p>
      </div>
    `;

    await this.send(email, 'Verificá tu email', html);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Resend error: ${JSON.stringify(error)}`);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
