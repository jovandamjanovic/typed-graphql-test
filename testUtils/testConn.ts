import mongoose from 'mongoose';

export const testConnection = async (drop = false) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/typegraphql-test');
        if (drop) {
            mongoose.connection.collections['recipes'].drop();
        }
        return mongoose.connection;
        
    } catch (error) {
        console.log(error);
    }
}
