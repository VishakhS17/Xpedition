/**
 * Script to create an admin user
 * 
 * Usage:
 *   npx tsx scripts/create-admin.ts <email> <password> [name]
 * 
 * Example:
 *   npx tsx scripts/create-admin.ts admin@xpedition.com mypassword123 "Admin User"
 */

// Load environment variables FIRST using require (synchronous, runs before imports)
const dotenv = require('dotenv');
const { resolve } = require('path');
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email> <password> [name]');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    // Dynamically import modules that depend on environment variables
    const { sql } = await import('../lib/db');
    const { hashPassword } = await import('../lib/auth');

    // Check if admin already exists
    const existing = await sql`
      SELECT id, email FROM admin_users WHERE email = ${email.toLowerCase().trim()}
    `;

    if (existing.length > 0) {
      console.error(`❌ Admin user with email ${email} already exists!`);
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await hashPassword(password);

    // Create admin user
    console.log('👤 Creating admin user...');
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES (${email.toLowerCase().trim()}, ${passwordHash}, ${name || null})
      RETURNING id, email, name, created_at
    `;

    if (result.length > 0) {
      const admin = result[0];
      console.log('✅ Admin user created successfully!');
      console.log('\n📋 Admin Details:');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name || 'N/A'}`);
      console.log(`   Created: ${admin.created_at}`);
      console.log('\n🔑 You can now login at /admin/login');
    } else {
      console.error('❌ Failed to create admin user');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();

