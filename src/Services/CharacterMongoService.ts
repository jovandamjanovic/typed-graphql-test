import ICharacterService from '../Interfaces/CharacterService';
import { Character, NewCharacterInput, CharacterModel } from '../Types/Character';

export default class CharacterMongoService implements ICharacterService {
    async findById(id: string): Promise<Character | null | undefined> {
        try {
            return await CharacterModel.findById(id);
        } catch (error) {
            throw error;
        }
    }
    async findAll(): Promise<Character[]> {
        try {
            return await CharacterModel.find();
        } catch (error) {
            throw error;
        }
    }
    async addCharacter(characterInput: NewCharacterInput): Promise<Character> {
        try {
            return CharacterModel.create(characterInput);
        } catch (error) {
            throw error;
        }
    }
    async updateCharacter(character: Character): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteCharacter(id: string): Promise<void> {
        try {
            await CharacterModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}
