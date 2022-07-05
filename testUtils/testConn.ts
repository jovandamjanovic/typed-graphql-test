import mongoose from 'mongoose';

export const testConnection = async (drop = false) => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/typegraphql-test');
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
