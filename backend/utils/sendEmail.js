const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If no SMTP configured, skip email in dev mode
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('─────────────────────────────────────────');
        console.log('⚠️  No SMTP configured – email NOT sent');
        console.log(`   To: ${options.email}`);
        console.log(`   Subject: ${options.subject}`);
        console.log(`   Body: ${options.message}`);
        console.log('─────────────────────────────────────────');
        console.log('💡 To enable emails, add SMTP_HOST, SMTP_USER, SMTP_PASS to .env');
        return; // Skip – caller should handle the "no email" case
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Bus Book-Ur-Seat'} <${process.env.FROM_EMAIL || 'noreply@bookurseat.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || `<p>${options.message}</p>`
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
