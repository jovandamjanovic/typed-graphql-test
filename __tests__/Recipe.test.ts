import { graphql, GraphQLSchema } from 'graphql';
import { Connection } from 'mongoose';
import { buildSchema } from 'type-graphql';
import RecipeResolver from '../src/Resolvers/Recipe';
import { Recipe } from '../src/Types/Recipe';
import { testConnection } from '../testUtils/testConn';

describe('Recipe Resolver', () => {
    let schema: GraphQLSchema;
    let conn: Connection | undefined;
    let createdId: string;

    beforeAll(async () => {
        conn = await testConnection(true);
        schema = await buildSchema({ resolvers: [RecipeResolver] });
    });
    it('adds a new recipe to the database', async () => {
        const mutation = `mutation {
            addRecipe(newRecipe: {
                title: "Stevan Sindjelic 3",
                description: "Mislili su da je gotovo sa barutanom. Prevarili su se.",
                ingredients: ["Stevan", "AK47", "barutana", "turci", "turci", "turci"]
            }) {
              _id
              title
              description
              ingredients
            }
        }`;

        const result = await graphql(schema, mutation);
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.addRecipe as Recipe;

        expect(resultData._id).toBeTruthy();
        createdId = resultData._id;
        expect(resultData.title).toEqual('Stevan Sindjelic 3');
        expect(resultData.description).toEqual('Mislili su da je gotovo sa barutanom. Prevarili su se.');
        expect(resultData.ingredients).toHaveLength(6);
    });
    it('returns a single recipe by id from the database', async () => {
        const query = `query Recipe($recipeId: String!) {
            recipe(id: $recipeId) {
              title
              description
              ingredients
            }
          }`;

        const result = await graphql(schema, query, null, null, { recipeId: createdId });
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.recipe as Recipe;

        expect(resultData.title).toEqual('Stevan Sindjelic 3');
        expect(resultData.description).toEqual('Mislili su da je gotovo sa barutanom. Prevarili su se.');
        expect(resultData.ingredients).toHaveLength(6);
    });
    it('fails to find a recipe with wrong id', async () => {
        const query = `query Recipe($recipeId: String!) {
            recipe(id: $recipeId) {
              title
              description
              ingredients
            }
          }`;

        const result = await graphql(schema, query, null, null, { recipeId: 'come invalid id' });
        expect(result.data).toBeNull();
        expect(result.errors).toHaveLength(1);
        expect(result.errors?.[0].message).toEqual('Recipe not found!');
    });
    it('return a list of recipes', async () => {
        const query = `query {
            recipes {
              _id
              title
              creationDate
            }
        }`;

        const result = await graphql(schema, query);
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.recipes as Recipe[];

        expect(resultData).toHaveLength(1);
    });
    it('removes a recipe by id from the database', async () => {
        const mutation = `mutation RemoveRecipe($removeRecipeId: String!) {
            removeRecipe(id: $removeRecipeId)
          }`;

        const result = await graphql(schema, mutation, null, null, { removeRecipeId: createdId });

        expect(result.errors).toBeUndefined();
        expect(result.data?.removeRecipe).toBe(true);
    });
    afterAll(async () => {
        if (conn) {
            conn.close();
        }
    });
});
