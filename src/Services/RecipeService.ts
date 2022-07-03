import { NewRecipeInput, Recipe, RecipesArgs } from '../Types/Recipe';

export default class RecipeService {
    private recipes: Recipe[] = [
        {
            id: '1',
            title: 'First Test',
            description: 'This is the first testing recipe',
            creationDate: new Date('6/29/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            id: '2',
            title: 'Second Test',
            description: 'This is the second testing recipe',
            creationDate: new Date('6/30/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            id: '3',
            title: 'Third Test',
            description: 'This is the third testing recipe',
            creationDate: new Date('7/1/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            id: '4',
            title: 'Fourth Test',
            description: 'This is the fourth testing recipe',
            creationDate: new Date('7/2/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
        {
            id: '5',
            title: 'Fifth Test',
            description: 'This is the fifth testing recipe',
            creationDate: new Date('7/3/2022'),
            ingredients: ['Sugar', 'Butter', 'Flour'],
        },
    ];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public findById(id: string) {
        return this.recipes.find((r) => r.id === id);
    }

    public findAll({skip, take}: RecipesArgs) {
        return this.recipes.slice(skip, skip + take);
    }

    public addRecipe(recipeInput: NewRecipeInput) {
        const newRecipe = new Recipe(recipeInput);
        this.recipes = [...this.recipes, newRecipe];
        return newRecipe;
    }

    public updateRecipe(recipe: Recipe) {
        this.recipes = this.recipes.map((rec: Recipe) => (rec.id === recipe.id ? recipe : rec));
    }

    public deleteRecipe(id: string) {
        this.recipes = this.recipes.filter((recipe: Recipe) => recipe.id !== id);
    }
}
