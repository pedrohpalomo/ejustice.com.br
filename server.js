/**
 * server.js — backend simples para:
 * - servir os arquivos estáticos (pasta /public)
 * - receber o POST do formulário /api/contact e enviar por e-mail
 *
 * Como usar:
 * 1) npm init -y
 * 2) npm i express nodemailer cors
 * 3) crie a pasta /public e coloque index.html, styles.css, script.js e /assets, /downloads
 * 4) configure as variáveis de ambiente abaixo e rode: node server.js
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public')); // tudo da pasta /public

// --- rota de saúde
app.get('/health', (req,res)=> res.json({ok:true}));

// --- rota de contato
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body || {};
    if(!name || !email || !message){
      return res.status(400).json({ error: 'Nome, e-mail e mensagem são obrigatórios.' });
    }

    // Configure seu SMTP (Gmail com App Password, Amazon SES, Mailgun, etc.)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'seu-email@dominio.com',
        pass: process.env.SMTP_PASS || 'sua-senha-ou-app-password'
      }
    });

    const mailOptions = {
      from: `"Site eJustice" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || 'contato@ejustice.com.br',
      subject: `Novo contato via site — ${service || 'Assunto'}`,
      replyTo: email,
      text: `
Nome: ${name}
E-mail: ${email}
Telefone: ${phone || '-'}
Assunto: ${service || '-'}
Mensagem:
${message}
      `,
      html: `
        <h2>Novo contato via site</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || '-'}</p>
        <p><strong>Assunto:</strong> ${service || '-'}</p>
        <p><strong>Mensagem:</strong><br>${(message||'').replace(/\n/g,'<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] error', err);
    res.status(500).json({ error: 'Falha ao enviar o e-mail.' });
  }
});

// --- start
app.listen(PORT, () => {
  console.log(`eJustice server rodando em http://localhost:${PORT}`);
});