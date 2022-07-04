/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import IRecipeService from '../Interfaces/RecipeService';
import RecipeService from '../Services/RecipeMongoService';
import { NewRecipeInput, Recipe, RecipesArgs } from '../Types/Recipe';

@Resolver(of => Recipe)
export class RecipeResolver {
    private recipeService: IRecipeService = new RecipeService();

    @Query((returns) => Recipe)
    async recipe(@Arg('id') id: string) {
        const recipe = await this.recipeService.findById(id);
        if (!recipe) {
            throw new Error('Recipe not found!');
        }
        return recipe;
    }

    @Query((returns) => [Recipe])
    recipes(@Args() args: RecipesArgs) {
        return this.recipeService.findAll(args);
    }

    @Mutation((returns) => Recipe)
    async addRecipe(@Arg('newRecipe') newRecipeInput: NewRecipeInput): Promise<Recipe> {
        return this.recipeService.addRecipe(newRecipeInput);
    }

    @Mutation((returns) => Boolean)
    async removeRecipe(@Arg('id') id: string): Promise<boolean> {
        try {
            await this.recipeService.deleteRecipe(id);
            return true;
        } catch {
            return false;
        }
    }
}
