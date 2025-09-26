import nodemailer from 'nodemailer';

// Configuration du transporteur
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blackhatvps0@gmail.com',
        pass: 'jyvb lycb lovj huqv' // mot de passe de l'application
    }
});

// Fonction pour envoyer un email
export async function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: '"BLACK HAT VPS 🚀" <blackhatvps0@gmail.com>',
        to: to,
        subject: subject,
        html: htmlContent
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return true;
    } catch (error) {
        console.error('Erreur email: ', error);
        return false;
    }
}