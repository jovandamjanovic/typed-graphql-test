import mongoose from 'mongoose';

export const testConnection = async (drop = false) => {
    try {
        const conn = await mongoose.connect(
            `mongodb://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@localhost:8888/${process.env.TEST_DB_NAME}`,
        );
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
