import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import { ArrayMaxSize, Length, Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';

@InputType()
export class NewRecipeInput {
    @Field()
    @MaxLength(30)
    title!: string;

    @Field({ nullable: true })
    @Length(30, 255)
    description?: string;

    @Field(() => [String])
    @ArrayMaxSize(30)
    ingredients!: string[];
}

@pre<Recipe>('save', function () {
    this.creationDate = new Date();
})
@ObjectType()
export class Recipe {
    constructor({ title, description, ingredients }: NewRecipeInput) {
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
    }

    @Field(() => ID)
    _id!: string;

    @prop({ required: true })
    @Field()
    title!: string;

    @prop()
    @Field({ nullable: true })
    description?: string;

    @prop()
    @Field()
    creationDate!: Date;

    @prop({ type: () => [String], required: true })
    @Field(() => [String])
    ingredients!: string[];
}

@ArgsType()
export class RecipesArgs {
    @Field(() => Int)
    @Min(0)
    skip = 0;

    @Field(() => Int)
    @Min(10)
    @Max(50)
    take = 25;
}

const RecipeModel = getModelForClass(Recipe);
export { RecipeModel };
