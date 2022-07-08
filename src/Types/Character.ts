import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import { ObjectType, Field, ID, Int, InputType } from 'type-graphql';
import generate from '../Util/generate-id';

@InputType()
export class StatInput {
    @prop({ required: true })
    @Field()
    name!: string;

    @prop({ required: true })
    @Field(() => Int)
    value!: number;

    @prop()
    @Field({ nullable: true })
    abbreviation?: string;
}

@ObjectType()
export class Stat {
    @prop({ required: true })
    @Field()
    name!: string;

    @prop({ required: true })
    @Field(() => Int)
    value!: number;

    @prop()
    @Field({ nullable: true })
    abbreviation?: string;

    @Field()
    modifier(): number {
        return Math.floor((this.value - 10) / 2);
    }
}

@InputType()
export class NewCharacterInput {
    @Field()
    name!: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [StatInput, StatInput, StatInput, StatInput, StatInput, StatInput])
    stats!: [StatInput, StatInput, StatInput, StatInput, StatInput, StatInput];
}

@pre<Character>('save', function () {
    this.creationDate = new Date();
    this._id = generate(12);
})
@ObjectType()
export class Character {
    @prop()
    @Field(() => ID)
    _id!: string;

    @prop({ required: true })
    @Field()
    name!: string;

    @prop()
    @Field({ nullable: true })
    description?: string;

    @prop()
    @Field()
    creationDate!: Date;

    @prop({ type: () => Stat, required: true })
    @Field(() => [Stat])
    stats!: Stat[];

    @Field(() => Int, { nullable: true })
    strength(): number | null {
        return this.stats.find((stat) => stat.name === 'Strength')?.value || null;
    }
    @Field(() => Int, { nullable: true })
    constitution(): number | null {
        return this.stats.find((stat) => stat.name === 'Constitution')?.value || null;
    }
    @Field(() => Int, { nullable: true })
    dexterity(): number | null {
        return this.stats.find((stat) => stat.name === 'Dexterity')?.value || null;
    }
    @Field(() => Int, { nullable: true })
    intelligence(): number | null {
        return this.stats.find((stat) => stat.name === 'Intelligence')?.value || null;
    }
    @Field(() => Int, { nullable: true })
    wisdom(): number | null {
        return this.stats.find((stat) => stat.name === 'Wisdom')?.value || null;
    }
    @Field(() => Int, { nullable: true })
    charisma(): number | null {
        return this.stats.find((stat) => stat.name === 'Charisma')?.value || null;
    }
}

export const CharacterModel = getModelForClass(Character);
