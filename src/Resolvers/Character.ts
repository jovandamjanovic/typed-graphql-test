/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import ICharacterService from '../Interfaces/CharacterService';
import CharacterService from '../Services/CharacterMongoService';
import { NewCharacterInput, Character } from '../Types/Character';

@Resolver((of) => Character)
class CharacterResolver {
    private characterService: ICharacterService = new CharacterService();

    @Query((returns) => Character)
    async character(@Arg('id') id: string) {
        const character = await this.characterService.findById(id);
        if (!character) {
            throw new Error('Character not found!');
        }
        return character;
    }

    @Query((returns) => [Character])
    characters() {
        return this.characterService.findAll();
    }

    @Mutation((returns) => Character)
    async addCharacter(@Arg('newCharacter') newCharacterInput: NewCharacterInput): Promise<Character> {
        return this.characterService.addCharacter(newCharacterInput);
    }

    @Mutation((returns) => Boolean)
    async removeCharacter(@Arg('id') id: string): Promise<boolean> {
        return await this.characterService.deleteCharacter(id);
    }
}

export default CharacterResolver;
