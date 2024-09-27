// jest.setup.ts
import dotenv from 'dotenv';
process.env.NODE_ENV = 'development';
// Load the environment variables from your actual .env file in src/configs
dotenv.config({ path: './src/configs/.env' });
