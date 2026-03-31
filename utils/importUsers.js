const ExcelJS = require('exceljs');
const bcrypt = require('bcrypt');
const userModel = require('../schemas/users');
const roleModel = require('../schemas/roles');
const { sendMail } = require('./sendMail');

// Generate random password 16 characters
function generateRandomPassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

module.exports = {
    importUsersFromExcel: async function (filePath) {
        try {
            // Read Excel file
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(1);

            // Get user role
            const userRole = await roleModel.findOne({ name: 'user', isDeleted: false });
            if (!userRole) {
                throw new Error('Role "user" not found in database');
            }

            let importedCount = 0;
            let errorCount = 0;
            const errors = [];
            const passwords = [];

            // Process each row (skip header row)
            worksheet.eachRow(async (row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header

                try {
                    const username = row.getCell(1).value;
                    const email = row.getCell(2).value;

                    // Validation
                    if (!username || !email) {
                        throw new Error(`Row ${rowNumber}: Username and email are required`);
                    }

                    // Check if user already exists
                    const existingUser = await userModel.findOne({
                        $or: [{ username }, { email }],
                        isDeleted: false
                    });

                    if (existingUser) {
                        throw new Error(`Row ${rowNumber}: Username or email already exists`);
                    }

                    // Generate password
                    const plainPassword = generateRandomPassword(16);
                    const hashedPassword = await bcrypt.hash(plainPassword, 10);

                    // Create user
                    const newUser = new userModel({
                        username: username.toString(),
                        email: email.toString().toLowerCase(),
                        password: hashedPassword,
                        role: userRole._id,
                        fullName: '',
                        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
                        status: false,
                        loginCount: 0
                    });

                    await newUser.save();

                    // Send email with password
                    const subject = `Your Account Credentials`;
                    const html = `
                        <h2>Welcome to our system</h2>
                        <p>Hello ${username},</p>
                        <p>Your account has been created successfully.</p>
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${plainPassword}</p>
                        <p>Please keep this password safe and change it after your first login.</p>
                    `;

                    await sendMail(email, subject, html);

                    passwords.push({
                        username,
                        email,
                        password: plainPassword
                    });

                    importedCount++;
                } catch (error) {
                    errorCount++;
                    errors.push({
                        row: rowNumber,
                        error: error.message
                    });
                }
            });

            return {
                success: true,
                importedCount,
                errorCount,
                errors,
                passwords
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
};
