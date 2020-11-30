import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// const databaseConfig = { connectionString: process.env.DATABASE_URL };
var client = new Client(process.env.DATABASE_URL);
// client.connect()

export default client;