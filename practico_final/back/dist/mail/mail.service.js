"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    cfg;
    logger = new common_1.Logger(MailService_1.name);
    resend;
    from;
    constructor(cfg) {
        this.cfg = cfg;
        const apiKey = this.cfg.getOrThrow('RESEND_API_KEY');
        this.from = this.cfg.get('MAIL_FROM') ?? 'onboarding@resend.dev';
        this.resend = new resend_1.Resend(apiKey);
    }
    async sendPasswordReset(email, resetLink) {
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
    async sendVerification(email, verifyLink) {
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
    async send(to, subject, html) {
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
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map