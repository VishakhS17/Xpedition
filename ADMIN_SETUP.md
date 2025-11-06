# Admin Authentication Setup Guide

This guide will help you set up admin authentication for the Xpedition admin dashboard.

## Prerequisites

- Database is set up and running (Neon PostgreSQL)
- Environment variables are configured in `.env.local`

## Step 1: Add JWT Secret to Environment Variables

Add the following to your `.env.local` file:

```env
JWT_SECRET=your-strong-random-secret-key-here
```

**Important:** Generate a strong random string for production. You can generate one using:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 2: Create Your First Admin User

Run the admin creation script:

```bash
npx tsx scripts/create-admin.ts <email> <password> [name]
```

**Example:**
```bash
npx tsx scripts/create-admin.ts admin@xpedition.com mySecurePassword123 "Admin User"
```

**Parameters:**
- `<email>`: Admin email address (required)
- `<password>`: Admin password (required)
- `[name]`: Admin name (optional)

The script will:
- Check if an admin with that email already exists
- Hash the password securely
- Create the admin user in the database
- Display the created admin details

## Step 3: Access the Admin Dashboard

1. Navigate to `/admin/login` in your browser
2. Enter your email and password
3. Click "LOGIN"
4. You'll be redirected to `/admin` dashboard

## Features

### Authentication
- **Secure Password Hashing**: Uses bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
- **Session Verification**: Automatic token verification on each request

### Admin Dashboard Protection
- All admin routes are protected
- Unauthenticated users are redirected to `/admin/login`
- Session expires after 7 days (configurable)

### Logout
- Click the "Logout" button in the admin dashboard
- Session is cleared and user is redirected to login

## API Routes

### `POST /api/auth/login`
Authenticate an admin user.

**Request Body:**
```json
{
  "email": "admin@xpedition.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@xpedition.com",
    "name": "Admin User"
  }
}
```

### `POST /api/auth/logout`
Logout the current admin user.

**Response:**
```json
{
  "success": true
}
```

### `GET /api/auth/verify`
Verify the current admin session.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "admin@xpedition.com",
    "name": "Admin User"
  }
}
```

## Creating Additional Admin Users

To create more admin users, simply run the script again with different credentials:

```bash
npx tsx scripts/create-admin.ts another@xpedition.com anotherPassword "Another Admin"
```

## Security Notes

1. **JWT Secret**: Never commit your JWT secret to version control. Keep it in `.env.local` which is in `.gitignore`.

2. **Password Strength**: Use strong passwords for admin accounts. Consider implementing password requirements in the future.

3. **HTTPS**: In production, ensure your site uses HTTPS to protect cookies and tokens in transit.

4. **Token Expiration**: Tokens expire after 7 days. Users will need to log in again after expiration.

5. **Database Security**: Ensure your database connection is secure (using SSL/TLS).

## Troubleshooting

### "Invalid email or password" Error
- Verify the email and password are correct
- Check that the admin user exists in the database
- Ensure the password was hashed correctly during creation

### "Unauthorized" or Redirect Loop
- Check that `JWT_SECRET` is set in `.env.local`
- Verify the token hasn't expired
- Clear browser cookies and try again

### Script Fails to Create Admin
- Verify database connection is working
- Check that the `admin_users` table exists (run `database/migration.sql` if needed)
- Ensure environment variables are loaded correctly

## Next Steps

- Consider adding password reset functionality
- Implement role-based access control (RBAC) if needed
- Add two-factor authentication (2FA) for enhanced security
- Set up admin activity logging

