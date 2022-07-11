import path from 'path';
import { buildSchema } from 'type-graphql';
import CharacterResolver from '../Resolvers/Character';
import RecipeResolver from '../Resolvers/Recipe';
import { TypegooseMiddleware } from './typegoose-middleware';

export const createSchema = () =>
    buildSchema({
        resolvers: [RecipeResolver, CharacterResolver],
        emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
        globalMiddlewares: [TypegooseMiddleware],
    });
