// Generic API for all businesses — Vercel serverless
let nodemailer;
try { nodemailer = require('nodemailer'); } catch(e) { nodemailer = null; }

const FROM = '"DataPriva" <crazycompanyincmail@gmail.com>';
const TO = 'crazycompanyincmail@gmail.com';

async function sendMail(transporter, opts) {
  return transporter.sendMail({ from: FROM, ...opts });
}

const LEAD_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f1a;font-family:Inter,Arial,sans-serif;color:#b0b8c4">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#111827;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
<tr><td style="padding:40px 40px 16px">
  <div style="font-size:20px;font-weight:700;color:#e8eaed;margin-bottom:4px">DataPriva</div>
  <div style="color:#5a6a80;font-size:13px">Tu checklist gratuito de compliance</div>
</td></tr>
<tr><td style="padding:8px 40px 24px">
  <h1 style="font-size:24px;font-weight:700;color:#e8eaed;margin:0 0 8px">Los 15 puntos que todo DPO debería revisar</h1>
  <p style="color:#8a8f98;font-size:15px;line-height:1.6;margin:0">Checklist completo de GDPR compliance para sistemas de IA.</p>
</td></tr>
<tr><td style="padding:0 40px 24px">
  <div style="background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.12);border-radius:8px;padding:20px;font-size:14px;line-height:2">
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">1.</strong> ¿Tienes inventario de todos los sistemas de IA en producción?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">2.</strong> ¿Clasificaste cada sistema por nivel de riesgo (AI Act)?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">3.</strong> ¿Documentaste los datos de entrenamiento de cada modelo?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">4.</strong> ¿Tienes consentimiento explícito para datos personales?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">5.</strong> ¿Puedes ejecutar el derecho de supresión en tus modelos?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">6.</strong> ¿Has evaluado bias en los outputs de tus modelos?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">7.</strong> ¿Tienes DPIA para sistemas de alto riesgo?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">8.</strong> ¿Documentaste las decisiones algorítmicas?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">9.</strong> ¿Tienes política de retención de datos de entrenamiento?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">10.</strong> ¿Evaluaste la explicabilidad de cada modelo?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">11.</strong> ¿Tienes proceso de gestión de incidentes IA?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">12.</strong> ¿Informas a los usuarios que usas IA?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">13.</strong> ¿Revisaste compliance de proveedores de IA externos?</div>
    <div style="margin-bottom:8px"><strong style="color:#38bdf8">14.</strong> ¿Tienes registro de actividades de tratamiento?</div>
    <div><strong style="color:#38bdf8">15.</strong> ¿Tu DPO ha revisado el cumplimiento?</div>
  </div>
</td></tr>
<tr><td style="padding:0 40px 16px;text-align:center">
  <a href="https://datapriva.vercel.app" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Quiero el framework completo</a>
  <div style="margin-top:8px;font-size:12px;color:#5a6a80">60 puntos de auditoría + plantillas + políticas</div>
</td></tr>
<tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06)">
  <p style="color:#5a6a80;font-size:13px;margin:0">— DataPriva. Checklist basado en el EU AI Act y GDPR.</p>
</td></tr>
</table>
</body></html>`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, empresa, message, type } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  if (!nodemailer) return res.status(500).json({ error: 'Servicio no disponible' });
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return res.status(500).json({ error: 'Servicio no configurado' });
  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: 'crazycompanyincmail@gmail.com', pass } });
    if (type === 'contact') {
      if (!name || !message) return res.status(400).json({ error: 'Nombre y mensaje requeridos' });
      await sendMail(transporter, { to: TO, replyTo: email, subject: `[Contacto] ${name}`, text: `Nombre: ${name}\nEmail: ${email}\nEmpresa: ${empresa||'N/A'}\n\n${message}` });
      return res.status(200).json({ ok: true });
    }
    if (type === 'lead') {
      await sendMail(transporter, { to: email, subject: 'Tu checklist GDPR para IA — 15 puntos', html: LEAD_HTML, text: 'Los 15 puntos que todo DPO debería revisar en los sistemas de IA de su empresa.\n\nAccede al framework completo en: https://datapriva.vercel.app' });
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Tipo no valido' });
  } catch (err) {
    console.error('Email error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
