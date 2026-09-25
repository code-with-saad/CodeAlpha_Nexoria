/**
 * Quick script to create / promote an admin account.
 * Run once:  node server/createAdmin.js
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';

const ADMIN_EMAIL    = 'admin@nexoria.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME     = 'Nexoria Admin';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let admin = await User.findOne({ email: ADMIN_EMAIL });

  if (admin) {
    // Already exists - just make sure role is admin
    admin.role = 'admin';
    await admin.save();
    console.log(`✅  Existing user promoted to admin: ${ADMIN_EMAIL}`);
  } else {
    // Create fresh admin user (password will be hashed by pre-save hook)
    admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`✅  Admin account created!`);
    console.log(`    Email   : ${ADMIN_EMAIL}`);
    console.log(`    Password: ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
