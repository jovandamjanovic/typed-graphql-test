/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrayMaxSize, Length, Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import generate from '../Util/generate-id';

@InputType()
export class NewRecipeInput {
    @Field()
    @MaxLength(30)
    title!: string;

    @Field({ nullable: true })
    @Length(30, 255)
    description?: string;

    @Field((type) => [String])
    @ArrayMaxSize(30)
    ingredients!: string[];
}

@ObjectType()
export class Recipe {
    constructor({title, description, ingredients}: NewRecipeInput) {
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.id = generate(12);
        this.creationDate = new Date();
    }

    @Field((type) => ID)
    id: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    creationDate: Date;

    @Field((type) => [String])
    ingredients: string[];
}

@ArgsType()
export class RecipesArgs {
    @Field(type => Int)
    @Min(0)
    skip = 0;

    @Field(type => Int)
    @Min(10)
    @Max(50)
    take = 25;
}