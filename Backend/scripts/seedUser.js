const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const connectToDb = require('../config/db');
const UserModel = require('../src/models/userModel');

dotenv.config();

(async () => {
  try {
    await connectToDb();
    const email = process.env.SEED_USER_EMAIL || 'test@healthyhabits.app';
    const password = process.env.SEED_USER_PASSWORD || 'Test@12345';
    const name = process.env.SEED_USER_NAME || 'Test User';

    let user = await UserModel.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await UserModel.create({ name, email, password: hashedPassword });
    console.log('Seeded user:', { email, password });
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
})();
