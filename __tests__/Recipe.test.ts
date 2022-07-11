import { Connection } from 'mongoose';
import { NewRecipeInput, Recipe, RecipeModel } from '../src/Types/Recipe';
import gCall from '../src/Util/gCall';
import { testConnection } from '../testUtils/testConn';

describe('Recipe Resolver', () => {
    let conn: Connection | undefined;
    let createdId: string;
    const newRecipe: NewRecipeInput = {
        title: 'Stevan Sindjelic 3',
        description: 'Mislili su da je gotovo sa barutanom. Prevarili su se.',
        ingredients: ['Stevan', 'AK47', 'barutana', 'turci', 'turci', 'turci'],
    };

    beforeAll(async () => {
        conn = await testConnection();
        await RecipeModel.deleteMany({});
    });
    it('adds a new recipe to the database', async () => {
        const source = `mutation AddRecipe($newRecipe: NewRecipeInput!){
            addRecipe(newRecipe: $newRecipe) {
              _id
              title
              description
              ingredients
            }
        }`;

        const result = await gCall({ source, variableValues: { newRecipe } });

        expect(result.errors).toBeUndefined();

        const resultData = result.data?.addRecipe as Recipe;

        expect(resultData._id).toBeTruthy();
        createdId = resultData._id;
        expect(resultData.title).toEqual('Stevan Sindjelic 3');
        expect(resultData.description).toEqual('Mislili su da je gotovo sa barutanom. Prevarili su se.');
        expect(resultData.ingredients).toHaveLength(6);
    });
    it('returns a single recipe by id from the database', async () => {
        const source = `query Recipe($recipeId: String!) {
            recipe(id: $recipeId) {
              title
              description
              ingredients
            }
          }`;

        const result = await gCall({ source, variableValues: { recipeId: createdId } });
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.recipe as Recipe;

        expect(resultData.title).toEqual('Stevan Sindjelic 3');
        expect(resultData.description).toEqual('Mislili su da je gotovo sa barutanom. Prevarili su se.');
        expect(resultData.ingredients).toHaveLength(6);
    });
    it('fails to find a recipe with wrong id', async () => {
        const source = `query Recipe($recipeId: String!) {
            recipe(id: $recipeId) {
              title
              description
              ingredients
            }
          }`;

        const result = await gCall({ source, variableValues: { recipeId: 'some invalid id' } });

        expect(result.data).toBeNull();
        expect(result.errors).toHaveLength(1);
        expect(result.errors?.[0].message).toEqual('Recipe not found!');
    });
    it('return a list of recipes', async () => {
        const source = `query {
            recipes {
              _id
              title
              creationDate
            }
        }`;

        const result = await gCall({ source });

        expect(result.errors).toBeUndefined();

        const resultData = result.data?.recipes as Recipe[];

        expect(resultData).toHaveLength(1);
    });
    it('removes a recipe by id from the database', async () => {
        const source = `mutation RemoveRecipe($removeRecipeId: String!) {
            removeRecipe(id: $removeRecipeId)
          }`;

        const result = await gCall({ source, variableValues: { removeRecipeId: createdId } });

        expect(result.errors).toBeUndefined();
        expect(result.data?.removeRecipe).toBe(true);
    });
    afterAll(async () => {
        if (conn) {
            conn.close();
        }
    });
});
