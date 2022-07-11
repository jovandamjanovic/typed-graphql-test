import 'dotenv/config';
import mongoose from 'mongoose';

const authString =
    process.env.TEST_DB_USER && process.env.TEST_DB_USER
        ? `${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@`
        : '';
const port = process.env.DB_PORT || 27017;

export const testConnection = async () => {
    try {
        const conn = await mongoose.connect(`mongodb://${authString}localhost:${port}/${process.env.TEST_DB_NAME || ''}`);
        return conn.connection;
    } catch (error) {
        console.log(error);
    }
};
