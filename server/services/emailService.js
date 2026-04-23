const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail App Password (not your regular password)
  }
});

exports.sendPasswordResetEmail = async (to, name, resetUrl) => {
  await transporter.sendMail({
    from: `"DRAPE" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Réinitialisation de votre mot de passe DRAPE',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background:#FAF9F6;font-family:'Georgia',serif;">
        <div style="max-width:520px;margin:40px auto;background:#fff;border:1px solid #e8e4de;">
          <div style="background:#1C1C1C;padding:32px;text-align:center;">
            <h1 style="margin:0;color:#C9A84C;font-size:28px;letter-spacing:0.3em;font-weight:400;">DRAPE</h1>
          </div>
          <div style="padding:40px 36px;">
            <p style="color:#1C1C1C;font-size:16px;margin:0 0 8px;">Bonjour ${name},</p>
            <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 28px;">
              Vous avez demandé la réinitialisation de votre mot de passe DRAPE.<br>
              Cliquez sur le bouton ci-dessous. Ce lien est valable <strong>1 heure</strong>.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}"
                style="background:#1C1C1C;color:#FAF9F6;text-decoration:none;padding:14px 36px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;display:inline-block;">
                Réinitialiser le mot de passe
              </a>
            </div>
            <p style="color:#999;font-size:12px;line-height:1.6;margin:28px 0 0;">
              Si vous n'avez pas fait cette demande, ignorez cet email — votre compte reste sécurisé.<br>
              Ce lien expirera automatiquement dans 1 heure.
            </p>
          </div>
          <div style="background:#FAF9F6;padding:20px;text-align:center;border-top:1px solid #e8e4de;">
            <p style="margin:0;color:#aaa;font-size:11px;letter-spacing:0.1em;">© 2025 DRAPE — Mode de luxe</p>
          </div>
        </div>
      </body>
      </html>
    `
  });
};
