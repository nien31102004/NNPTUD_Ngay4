const ExcelJS = require('exceljs');
const path = require('path');

// Create sample Excel file for user import
async function createSampleExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Add header row
    worksheet.columns = [
        { header: 'Username', key: 'username', width: 20 },
        { header: 'Email', key: 'email', width: 30 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

    // Add sample data
    const sampleUsers = [
        { username: 'ngvana2001', email: 'ana@example.com' },
        { username: 'nguyen.b', email: 'john@example.com' },
        { username: 'tran.c', email: 'tran@example.com' },
        { username: 'hoang.d', email: 'hoang@example.com' },
        { username: 'pham.e', email: 'pham@example.com' }
    ];

    sampleUsers.forEach(user => {
        worksheet.addRow(user);
    });

    // Save the file
    await workbook.xlsx.writeFile('sample_users.xlsx');
    console.log('Sample Excel file created: sample_users.xlsx');
}

createSampleExcel().catch(err => console.error('Error creating sample file:', err));
