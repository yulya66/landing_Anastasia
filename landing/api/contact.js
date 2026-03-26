const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, service, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  // Простая санитизация — убираем HTML-теги
  const clean = (str) => String(str || '—').replace(/[<>]/g, '');

  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const serviceNames = {
    family: 'Семейное право',
    labor: 'Трудовые споры',
    consumer: 'Защита прав потребителей',
    property: 'Имущественные споры',
    contract: 'Договорное право',
    auto: 'Автоюрист',
    admin: 'Административные дела',
    social: 'Защита социальных прав',
    business: 'Сопровождение бизнеса',
    military: 'Военное право',
    migration: 'Миграционное право',
    enforcement: 'Исполнительное производство',
    other: 'Другое',
  };

  const serviceName = serviceNames[service] || service || '—';

  try {
    await transporter.sendMail({
      from: `"Сайт ak-law66.ru" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      replyTo: email || undefined,
      subject: `Новая заявка: ${clean(name)} — ${clean(phone)}`,
      text: [
        `Имя: ${clean(name)}`,
        `Телефон: ${clean(phone)}`,
        `Email: ${clean(email)}`,
        `Направление: ${serviceName}`,
        `Сообщение: ${clean(message)}`,
      ].join('\n'),
      html: `
        <h2 style="color:#1a2744;">Новая заявка с сайта ak-law66.ru</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:8px 12px;font-weight:bold;color:#1a2744;">Имя</td><td style="padding:8px 12px;">${clean(name)}</td></tr>
          <tr style="background:#f8f5ef;"><td style="padding:8px 12px;font-weight:bold;color:#1a2744;">Телефон</td><td style="padding:8px 12px;">${clean(phone)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;color:#1a2744;">Email</td><td style="padding:8px 12px;">${clean(email)}</td></tr>
          <tr style="background:#f8f5ef;"><td style="padding:8px 12px;font-weight:bold;color:#1a2744;">Направление</td><td style="padding:8px 12px;">${serviceName}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;color:#1a2744;">Сообщение</td><td style="padding:8px 12px;">${clean(message)}</td></tr>
        </table>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ error: 'Ошибка отправки письма' });
  }
};
