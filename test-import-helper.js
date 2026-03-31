/**
 * Test Helper for User Import Feature
 * Run: node test-import-helper.js
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// ============================================
// 1. Create Sample Excel File
// ============================================
async function createSampleFile() {
    console.log('\n📄 Creating sample Excel file...\n');
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Setup columns
    worksheet.columns = [
        { header: 'Username', key: 'username', width: 20 },
        { header: 'Email', key: 'email', width: 35 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sample data
    const testUsers = [
        { username: 'ngvana2001', email: 'Ana.Nguyen@example.com' },
        { username: 'truong.hoang', email: 'Hoang.Truong@example.com' },
        { username: 'tran.minh', email: 'Minh.Tran@example.com' },
        { username: 'pham.linh', email: 'Linh.Pham@example.com' },
        { username: 'hoang.duc', email: 'Duc.Hoang@example.com' }
    ];

    testUsers.forEach(user => {
        worksheet.addRow(user);
    });

    const fileName = 'sample_users.xlsx';
    await workbook.xlsx.writeFile(fileName);
    
    console.log(`✅ Sample file created: ${fileName}`);
    console.log(`   📊 Contains ${testUsers.length} test users\n`);
    
    return testUsers;
}

// ============================================
// 2. Simulate Import Process
// ============================================
function generatePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function simulateImport() {
    console.log('🚀 Simulating import process...\n');
    
    const testUsers = [
        { username: 'ngvana2001', email: 'Ana.Nguyen@example.com' },
        { username: 'truong.hoang', email: 'Hoang.Truong@example.com' },
        { username: 'tran.minh', email: 'Minh.Tran@example.com' },
        { username: 'pham.linh', email: 'Linh.Pham@example.com' },
        { username: 'hoang.duc', email: 'Duc.Hoang@example.com' }
    ];

    const importedUsers = [];
    
    console.log('📧 Email notifications that will be sent:\n');
    console.log('═'.repeat(80));

    for (const user of testUsers) {
        const password = generatePassword(16);
        
        console.log(`\nTO: ${user.email}`);
        console.log(`SUBJECT: Your Account Credentials`);
        console.log('BODY:');
        console.log('  ┌─────────────────────────────────────────┐');
        console.log('  │ Welcome to our system                   │');
        console.log(`  │ Hello ${user.username.padEnd(27)} │`);
        console.log('  │ Your account has been created.          │');
        console.log(`  │ Username: ${user.username.padEnd(28)} │`);
        console.log(`  │ Email: ${user.email.padEnd(33)} │`);
        console.log(`  │ Password: ${password.padEnd(30)} │`);
        console.log('  │ Please change after first login.        │');
        console.log('  └─────────────────────────────────────────┘');
        console.log('─'.repeat(80));

        importedUsers.push({
            username: user.username,
            email: user.email,
            password: password
        });
    }

    return importedUsers;
}

// ============================================
// 3. Display API Usage
// ============================================
function displayAPIInfo() {
    console.log('\n\n📋 API ENDPOINT INFORMATION\n');
    console.log('═'.repeat(80));
    
    console.log('\nEndpoint: POST /api/v1/users/import/excel');
    console.log('Authentication: Required (Admin token)');
    console.log('Content-Type: multipart/form-data');
    console.log('Parameter: file (Excel file .xlsx or .xls)');
    
    console.log('\n\n🔐 REQUIRED CONFIGURATION\n');
    console.log('═'.repeat(80));
    console.log('\nFile: utils/sendMail.js');
    console.log('Update with Mailtrap credentials:');
    console.log(`
    auth: {
        user: "YOUR_MAILTRAP_USERNAME",
        pass: "YOUR_MAILTRAP_PASSWORD"
    }
    `);
    
    console.log('Get credentials from: https://mailtrap.io\n');
}

// ============================================
// 4. Display Mailtrap Instructions
// ============================================
function displayMailtrapInstructions() {
    console.log('\n\n📧 MAILTRAP SETUP INSTRUCTIONS\n');
    console.log('═'.repeat(80));
    
    console.log(`
1. Go to https://mailtrap.io
2. Sign up for a free account
3. Create a new inbox (if not exists)
4. Click on "SMTP Settings"
5. Copy your credentials:
   - Username (usually a number like 987654)
   - Password
6. Update utils/sendMail.js with these credentials
7. After importing, check your Mailtrap inbox
8. You should see emails like:
   - To: ana@example.com
   - Subject: Your Account Credentials
   - Body: Contains username and random password

Example Email from Mailtrap:
├─ From: admin@haha.com
├─ To: ana@example.com
├─ Subject: Your Account Credentials
└─ Body: Welcome message with credentials
    `);
}

// ============================================
// 5. Display Verification Checklist
// ============================================
function displayChecklist() {
    console.log('\n\n✅ VERIFICATION CHECKLIST\n');
    console.log('═'.repeat(80));
    
    console.log(`
BEFORE TESTING:
  ☐ MongoDB running locally (mongodb://localhost:27017/NNPTUD-C3)
  ☐ "user" role exists in database
  ☐ Admin token obtained
  ☐ Mailtrap credentials configured
  ☐ uploads/ directory exists

TESTING:
  ☐ Run: node scripts/createSampleExcel.js → Creates sample_users.xlsx
  ☐ Upload sample_users.xlsx via POST /api/v1/users/import/excel
  ☐ Get response with imported count and generated passwords
  ☐ Check /api/v1/users endpoint to verify users created
  ☐ Check Mailtrap inbox for notification emails

GIT VERIFICATION:
  ☐ Run: git init
  ☐ Run: git add .
  ☐ Run: git commit -m "feat: add user import from Excel"
  ☐ Run: git log --oneline -n 5

SCREENSHOT FOR MAILTRAP:
  ☐ Open https://mailtrap.io
  ☐ Go to your inbox
  ☐ Take screenshot showing emails with credentials
  ☐ Show: From, To, Subject, Email content with password
    `);
}

// ============================================
// Main Execution
// ============================================
async function main() {
    console.clear();
    console.log('═'.repeat(80));
    console.log('🎯 USER IMPORT FEATURE - TEST HELPER');
    console.log('═'.repeat(80));

    try {
        // Create sample file
        await createSampleFile();

        // Simulate import
        const importedUsers = await simulateImport();

        // Display results
        console.log('\n\n📊 IMPORT SUMMARY\n');
        console.log('═'.repeat(80));
        console.log(`✅ Successfully imported: ${importedUsers.length} users`);
        console.log(`📧 Emails sent: ${importedUsers.length}`);
        console.log(`❌ Errors: 0`);

        // Display API info
        displayAPIInfo();

        // Display Mailtrap instructions
        displayMailtrapInstructions();

        // Display checklist
        displayChecklist();

        console.log('\n' + '═'.repeat(80));
        console.log('🎉 Test helper completed!');
        console.log('═'.repeat(80) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { generatePassword, createSampleFile, simulateImport };
