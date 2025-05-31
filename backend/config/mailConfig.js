import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({ 
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "sbuscapet@gmail.com",
        pass: 'etucfepckqnqlsit'
    },
})

export default transporter