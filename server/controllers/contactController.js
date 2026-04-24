const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
exports.sendContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Nom, email et message requis' });
    }

    await resend.emails.send({
      from: 'DRAPE Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_USER || process.env.ADMIN_EMAIL || 'admin@drape.tn',
      replyTo: email,
      subject: `[DRAPE Contact] ${subject || 'Nouveau message'}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;">
          <div style="background:#1C1C1C;padding:24px;text-align:center;">
            <h2 style="margin:0;color:#C9A84C;letter-spacing:0.3em;font-weight:400;">DRAPE</h2>
          </div>
          <div style="padding:32px;border:1px solid #e8e4de;border-top:none;">
            <h3 style="margin:0 0 16px;font-size:18px;">Nouveau message de contact</h3>
            <p style="margin:0 0 8px;font-size:14px;color:#555;"><strong>Nom :</strong> ${name}</p>
            <p style="margin:0 0 8px;font-size:14px;color:#555;"><strong>Email :</strong> ${email}</p>
            ${subject ? `<p style="margin:0 0 8px;font-size:14px;color:#555;"><strong>Sujet :</strong> ${subject}</p>` : ''}
            <hr style="margin:20px 0;border:none;border-top:1px solid #e8e4de;" />
            <p style="font-size:14px;color:#333;line-height:1.8;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'Message envoyé avec succès' });
  } catch (err) {
    next(err);
  }
};
