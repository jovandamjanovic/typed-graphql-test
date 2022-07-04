import IRecipeService from '../Interfaces/RecipeService';
import { NewRecipeInput, Recipe, RecipeModel, RecipesArgs } from '../Types/Recipe';

export default class RecipeService implements IRecipeService {
    private recipes: Recipe[] = [
        {
            _id: '1',
            title: 'First Test',
            description: 'This is the first testing recipe',
            creationDate: new Date('6/29/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            _id: '2',
            title: 'Second Test',
            description: 'This is the second testing recipe',
            creationDate: new Date('6/30/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            _id: '3',
            title: 'Third Test',
            description: 'This is the third testing recipe',
            creationDate: new Date('7/1/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            _id: '4',
            title: 'Fourth Test',
            description: 'This is the fourth testing recipe',
            creationDate: new Date('7/2/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            _id: '5',
            title: 'Fifth Test',
            description: 'This is the fifth testing recipe',
            creationDate: new Date('7/3/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
    ];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public async findById(id: string) {
        try {
            const recipe = await RecipeModel.findById(id);
            return recipe;
        } catch (error) {
            throw error;
        }
    }

    public async findAll({skip, take}: RecipesArgs) {
        return this.recipes.slice(skip, skip + take);
    }

    public async addRecipe(recipeInput: NewRecipeInput) {
        const newRecipe = new Recipe(recipeInput);
        this.recipes = [...this.recipes, newRecipe];
        return newRecipe;
    }

    public async updateRecipe(recipe: Recipe) {
        this.recipes = this.recipes.map((rec: Recipe) => (rec._id === recipe._id ? recipe : rec));
    }

    public async deleteRecipe(id: string): Promise<void> {
        this.recipes = this.recipes.filter((recipe: Recipe) => recipe._id !== id);
    }
}
