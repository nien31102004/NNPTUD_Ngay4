#!/bin/bash
# User Import API - Testing Examples
# Run these commands to test the import functionality

# ============================================
# 1. Generate Sample Excel File
# ============================================
echo "Step 1: Generate sample Excel file..."
node scripts/createSampleExcel.js


# ============================================
# 2. Test Import via cURL (PowerShell version)
# ============================================
# For PowerShell on Windows, use:
# $headers = @{
#     "Authorization" = "Bearer YOUR_ADMIN_TOKEN"
# }
# Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users/import/excel" `
#     -Method Post `
#     -Headers $headers `
#     -Form @{file=Get-Item -Path "sample_users.xlsx"}


# ============================================
# 3. Check Imported Users
# ============================================
echo ""
echo "Step 3: Check all users to verify import..."
echo "GET http://localhost:3000/api/v1/users"
echo "Headers: Authorization: Bearer YOUR_ADMIN_TOKEN"


# ============================================
# 4. Check Mailtrap for Emails
# ============================================
echo ""
echo "Step 4: Check Mailtrap for sent emails"
echo "Visit: https://mailtrap.io/inbox"
echo "Each imported user should have 1 email with their password"


# ============================================
# EXAMPLE: Complete Test Flow
# ============================================
: '
Windows PowerShell Example:

# 1. First, create admin user and get token (manual or from existing admin)
$AdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Create sample Excel file
node scripts/createSampleExcel.js

# 3. Upload and import
$headers = @{
    "Authorization" = "Bearer $AdminToken"
}

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users/import/excel" `
    -Method Post `
    -Headers $headers `
    -Form @{
        file = Get-Item -Path ".\sample_users.xlsx"
    }

$response.Content | ConvertFrom-Json | ConvertTo-Json

# 4. Verify in Mailtrap
Start-Process "https://mailtrap.io/inbox"

# 5. Look for emails with passwords for each user
'

# ============================================
# CURL Examples (Linux/Mac style)
# ============================================
: '
# For Linux/Mac terminal:

# 1. Get admin token first (example)
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"password\"}" \
  | jq -r ".token")

# 2. Import users from Excel
curl -X POST http://localhost:3000/api/v1/users/import/excel \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@sample_users.xlsx"

# 3. Get all users
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"

# 4. Or use PowerShell equivalent:
# $token = "YOUR_TOKEN_HERE"
# Invoke-WebRequest "http://localhost:3000/api/v1/users" `
#     -Headers @{"Authorization"="Bearer $token"}
'

echo ""
echo "✓ Testing guide completed"
echo ""
echo "Important Mailtrap Configuration:"
echo "1. Visit https://mailtrap.io"
echo "2. Get SMTP credentials from your inbox settings"
echo "3. Update utils/sendMail.js with credentials:"
echo "   auth: { user: YOUR_USER, pass: YOUR_PASS }"
