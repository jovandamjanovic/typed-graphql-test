import IRecipeService from '../Interfaces/RecipeService';
import { Recipe, RecipesArgs, NewRecipeInput, RecipeModel } from '../Types/Recipe';

export default class RecipeMongoService implements IRecipeService {
    async findById(id: string): Promise<Recipe | null | undefined> {
        try {
            const recipe = await RecipeModel.findById(id);
            return recipe;
        } catch (error) {
            throw error;
        }
    }
    async findAll({ skip, take }: RecipesArgs): Promise<Recipe[]> {
        try {
            const recipes = await RecipeModel.find();
            return recipes.slice(skip, skip + take);
        } catch (error) {
            throw error;
        }
    }
    async addRecipe(recipeInput: NewRecipeInput): Promise<Recipe> {
        try {
            const recipe = await RecipeModel.create(recipeInput);
            return recipe;
        } catch (error) {
            throw error;
        }
    }
    updateRecipe(recipe: Recipe): void {
        throw new Error('Method not implemented.');
    }
    async deleteRecipe(id: string): Promise<void> {
        try {
            await RecipeModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}
