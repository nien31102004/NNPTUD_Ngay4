const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "YOUR_MAILTRAP_USER",
        pass: "YOUR_MAILTRAP_PASS",
    },
});

module.exports = {
    sendMail: async function (to, subject, html, url = null) {
        // Handle both old format (to, url) and new format (to, subject, html)
        let mailOptions = {};
        
        if (url) {
            // Old format for reset password
            mailOptions = {
                from: 'admin@haha.com',
                to: to,
                subject: subject || "reset password email",
                text: "click vao day de doi pass",
                html: html || "click vao <a href=" + url+ ">day</a> de doi pass",
            };
        } else {
            // New format
            mailOptions = {
                from: 'admin@haha.com',
                to: to,
                subject: subject,
                html: html,
            };
        }
        
        await transporter.sendMail(mailOptions);
    }
}

// Send an email using async/await
