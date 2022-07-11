import { Character, NewCharacterInput } from '../Types/Character';

interface ICharacterService {
    findById(id: string): Promise<Character | null | undefined>;
    findAll(): Promise<Character[]>;
    addCharacter(characterInput: NewCharacterInput): Promise<Character>;
    updateCharacter(character: Character): Promise<void>;
    deleteCharacter(id: string): Promise<boolean>;
}

export default ICharacterService;