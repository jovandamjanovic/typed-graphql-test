import { Recipe, RecipesArgs, NewRecipeInput } from '../Types/Recipe';

interface IRecipeService {
    findById(id: string): Promise<Recipe | null | undefined>;
    findAll({skip, take}: RecipesArgs): Promise<Recipe[]>;
    addRecipe(recipeInput: NewRecipeInput): Promise<Recipe>;
    updateRecipe(recipe: Recipe): void;
    deleteRecipe(id: string): Promise<void>;
}

export default IRecipeService;