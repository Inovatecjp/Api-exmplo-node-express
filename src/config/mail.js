const mailConfig = {
    host: process.env.EMAIL_HOST || "smtp.hostinger.com",
    port: process.env.EMAIL_PORT || "587",
    secure: process.env.EMAIL_STARTTLS || true,
    user: process.env.EMAIL_USER || "contatosinovatec@jpafit.com.br",
    pass: process.env.EMAIL_PASSWORD || "Inovat3cJp@",
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    apiUrl: process.env.API_URL || "http://localhost:3010",
};

module.exports = mailConfig;