const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    // Use SMTP environment variables if provided, otherwise fallback to Ethereal Email for testing
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback: Generate an Ethereal test account on the fly
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        console.log(`⚠️ Using Ethereal Email for testing. Real emails won't be sent unless SMTP is configured in .env.`);
    }

    const message = {
        from: `${process.env.FROM_NAME || 'Bus Book-Ur-Seat'} <${process.env.FROM_EMAIL || 'noreply@bookurseat.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || `<p>${options.message}</p>` // Simple fallback HTML
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    // Preview URL will only be available when using Ethereal email
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
