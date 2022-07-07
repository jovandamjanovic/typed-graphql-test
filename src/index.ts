import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';

const main = async () => {
    const schema = await buildSchema({
        resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    });
    await mongoose.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:8888/${process.env.DB_NAME}`,
    );

    const apollo = new ApolloServer({ schema });

    const app = Express();

    await apollo.start();
    apollo.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('Server listening on http://localhost:4000/graphql');
    });
};

main();
