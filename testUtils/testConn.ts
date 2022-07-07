import 'dotenv/config';
import mongoose from 'mongoose';

const authString =
    process.env.TEST_DB_USER && process.env.TEST_DB_USER
        ? `${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@`
        : '';
const port = process.env.DB_PORT || 27017;

export const testConnection = async (drop = false) => {
    try {
        const conn = await mongoose.connect(`mongodb://${authString}localhost:${port}/${process.env.TEST_DB_NAME || ''}`);
        const collectionList = ['recipes'];
        if (drop && conn.connection.db.listCollections({ name: 'recipes' })) {
            const existingCollections = await (await conn.connection.db.listCollections().toArray()).map((c) => c.name);
            await Promise.all(
                collectionList.map(async (collection) => {
                    if (!existingCollections.find((c) => c === collection)) {
                        return;
                    }
                    return await conn.connection.collections[collection].drop();
                }),
            );
        }
        return conn.connection;
    } catch (error) {
        console.log(error);
    }
};
