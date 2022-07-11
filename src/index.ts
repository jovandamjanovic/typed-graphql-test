import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import mongoose from 'mongoose';
import { createSchema } from './Util/createSchema';

const main = async () => {
    const schema = await createSchema();
    await mongoose.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`,
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
