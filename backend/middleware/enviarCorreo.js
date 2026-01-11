const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
})

const enviarCorreo = async (destinatario, asunto, mensajeHTML) => {
    const emailOption = {
        from: process.env.EMAIL_USER, 
        to: destinatario, 
        subject: asunto, 
        html: mensajeHTML
    }
    return transporter.sendMail(emailOption)
}

module.exports = {enviarCorreo}