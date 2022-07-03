import { Recipe, RecipesArgs, NewRecipeInput } from '../Types/Recipe';

interface IRecipeService {
    findById(id: string): Recipe | undefined;
    findAll({skip, take}: RecipesArgs): Recipe[];
    addRecipe(recipeInput: NewRecipeInput): Recipe;
    updateRecipe(recipe: Recipe): void;
    deleteRecipe(id: string): void;
}

export default IRecipeService;