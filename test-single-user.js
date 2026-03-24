/**
 * Test: Import Single User & Send Email
 * Purpose: Test password generation and email sending
 * Run: node test-single-user.js
 */

const userController = require('./controllers/users');
const userModel = require('./schemas/users');
const roleModel = require('./schemas/roles');
const bcrypt = require('bcrypt');
const { sendMail } = require('./utils/sendMail');

// Generate random 16-char password
function generatePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function createTestUser() {
    try {
        console.log('🚀 Starting test...\n');

        // 1. Get user role
        const userRole = await roleModel.findOne({ name: 'user', isDeleted: false });
        if (!userRole) {
            console.error('❌ Error: Role "user" not found in database');
            console.log('   Create it first: db.roles.insertOne({ name: "user" })');
            process.exit(1);
        }

        // 2. Generate password
        const plainPassword = generatePassword(16);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        console.log('📋 Test User Data:');
        console.log('─'.repeat(60));
        console.log(`Username:        testuser_${Date.now()}`);
        console.log(`Email:           testuser@example.com`);
        console.log(`Password (Plain): ${plainPassword}`);
        console.log(`Password (Hashed): ${hashedPassword.substring(0, 50)}...`);
        console.log(`Role:            user`);
        console.log('─'.repeat(60));

        // 3. Create user
        const username = `testuser_${Date.now()}`;
        const email = 'testuser@example.com';

        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword,
            role: userRole._id,
            fullName: 'Test User',
            avatarUrl: 'https://i.sstatic.net/l60Hf.png',
            status: false,
            loginCount: 0
        });

        await newUser.save();
        console.log('\n✅ User created in MongoDB\n');

        // 4. Send email
        const subject = 'Your Account Credentials';
        const html = `
            <h2>Welcome to our system</h2>
            <p>Hello ${username},</p>
            <p>Your account has been created successfully.</p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${plainPassword}</p>
            <p style="color: red;">⚠️ Please keep this password safe and change it after your first login.</p>
        `;

        await sendMail(email, subject, html);
        console.log('📧 Email sent to Mailtrap!\n');

        // 5. Show instructions
        console.log('📸 NEXT STEPS:');
        console.log('─'.repeat(60));
        console.log('1. Go to: https://mailtrap.io');
        console.log(`2. Check inbox for email to: ${email}`);
        console.log('3. Open the email');
        console.log('4. You should see:');
        console.log(`   - Username: ${username}`);
        console.log(`   - Email: ${email}`);
        console.log(`   - Password: ${plainPassword}`);
        console.log('5. Take screenshot and show to teacher 📸');
        console.log('─'.repeat(60));
        console.log('\n✨ Test complete!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Connect to MongoDB and run
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/NNPTUD-C3')
    .then(() => {
        console.log('Connected to MongoDB\n');
        return createTestUser();
    })
    .then(() => {
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(error => {
        console.error('Database error:', error);
        process.exit(1);
    });
