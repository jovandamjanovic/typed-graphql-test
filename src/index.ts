import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { RecipeResolver } from './Resolvers/Recipe';

const main = async () => {
    const schema = await buildSchema({
        resolvers: [RecipeResolver],
    });

    const apollo = new ApolloServer({ schema });

    const app = Express();

    await apollo.start();
    apollo.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('Server listening on http://localhost:4000/graphql');
    });
};

main();
