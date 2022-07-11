import { Connection } from 'mongoose';
import { Character, CharacterModel, NewCharacterInput } from '../src/Types/Character';
import { testConnection } from '../testUtils/testConn';
import gCall from '../src/Util/gCall';

describe('Character Resolver', () => {
    let conn: Connection | undefined;
    let createdId: string;
    const testCharacter: NewCharacterInput = {
        name: 'Test Character',
        description:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore atque ea quidem quo libero, a odit similique aliquam nihil itaque. Odio quaerat optio ad rerum!',
        stats: [
            {
                name: 'Strength',
                value: 10,
                abbreviation: 'Str',
            },
            {
                name: 'Dexterity',
                value: 11,
                abbreviation: 'Dex',
            },
            {
                name: 'Constitution',
                value: 12,
                abbreviation: 'Con',
            },
            {
                name: 'Intelligence',
                value: 13,
                abbreviation: 'Int',
            },
            {
                name: 'Wisdom',
                value: 14,
                abbreviation: 'Wis',
            },
            {
                name: 'Charisma',
                value: 15,
                abbreviation: 'Cha',
            },
        ],
    };

    beforeAll(async () => {
        conn = await testConnection();
        await CharacterModel.deleteMany({});
    });
    it('adds a new character to the database', async () => {
        const source = `mutation AddCharacter($newCharacter: NewCharacterInput!) {
          addCharacter(newCharacter: $newCharacter) {
            _id
            name
            description
            stats {
              name
              value
            }
          }
        }`;

        const result = await gCall({ source, variableValues: { newCharacter: testCharacter } });
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.addCharacter as Character;

        expect(resultData._id).toBeTruthy();
        createdId = resultData._id;
        expect(resultData.name).toEqual(testCharacter.name);
        expect(resultData.description).toEqual(testCharacter.description);
        expect(resultData.stats).toHaveLength(6);
    });
    it('returns a single character by id from the database', async () => {
        const source = `query Character($characterId: String!) {
            character(id: $characterId) {
              _id
              name
              description
              stats {
                name
              }
              strength
              dexterity
              constitution
              intelligence
              wisdom
              charisma
            }
          }`;

        const result = await gCall({ source, variableValues: { characterId: createdId } });

        expect(result.errors).toBeUndefined();

        const resultData = result.data?.character as Character;

        expect(resultData.name).toEqual(testCharacter.name);
        expect(resultData.description).toEqual(testCharacter.description);
        expect(resultData.stats).toHaveLength(6);
        expect(resultData.strength).toEqual(testCharacter.stats.find((stat) => stat.name === 'Strength')?.value);
        expect(resultData.dexterity).toEqual(testCharacter.stats.find((stat) => stat.name === 'Dexterity')?.value);
        expect(resultData.constitution).toEqual(
            testCharacter.stats.find((stat) => stat.name === 'Constitution')?.value,
        );
        expect(resultData.intelligence).toEqual(
            testCharacter.stats.find((stat) => stat.name === 'Intelligence')?.value,
        );
        expect(resultData.wisdom).toEqual(testCharacter.stats.find((stat) => stat.name === 'Wisdom')?.value);
        expect(resultData.charisma).toEqual(testCharacter.stats.find((stat) => stat.name === 'Charisma')?.value);
    });
    it('fails to find a character with wrong id', async () => {
        const source = `query Character($characterId: String!) {
            character(id: $characterId) {
              _id
              name
              description
              stats {
                name
                value
              }
            }
          }`;

        const result = await gCall({ source, variableValues: { characterId: 'some invalid id' } });

        expect(result.data).toBeNull();
        expect(result.errors).toHaveLength(1);
        expect(result.errors?.[0].message).toEqual('Character not found!');
    });
    describe('custom stats return null if stat not in stats', () => {
        const inputChar: NewCharacterInput = {
            name: 'testStat',
            stats: [
                { name: 't1', value: 10 },
                { name: 't2', value: 10 },
                { name: 't3', value: 10 },
                { name: 't4', value: 10 },
                { name: 't5', value: 10 },
                { name: 't6', value: 10 },
            ],
        };
        let createdChar: Character;
        beforeEach(async () => {
            const source = `mutation AddCharacter($newCharacter: NewCharacterInput!) {
          addCharacter(newCharacter: $newCharacter) {
            _id
            strength
            dexterity
            constitution
            intelligence
            wisdom
            charisma
          }
        }`;
            const result = await gCall({ source, variableValues: { newCharacter: inputChar } });
            createdChar = result.data?.addCharacter as Character;
        });
        afterEach(async () => {
            const source = `mutation RemoveCharacter($removeCharacterId: String!) {
            removeCharacter(id: $removeCharacterId)
          }`;
            await gCall({ source, variableValues: { removeCharacterId: createdChar._id } });
        });
        it('strength', async () => {
            console.log(createdChar);
            expect(createdChar.strength).toBeNull();
        });
        it('dexterity', async () => {
            expect(createdChar.dexterity).toBeNull();
        });
        it('constitution', async () => {
            expect(createdChar.constitution).toBeNull();
        });
        it('intelligence', async () => {
            expect(createdChar.intelligence).toBeNull();
        });
        it('wisdom', async () => {
            expect(createdChar.wisdom).toBeNull();
        });
        it('charisma', async () => {
            expect(createdChar.charisma).toBeNull();
        });
    });
    it('calculates the stat modifiers properly', async () => {
        const source = `query Character($characterId: String!) {
            character(id: $characterId) {
              stats {
                value
                modifier
              }
            }
          }`;

        const result = await gCall({ source, variableValues: { characterId: createdId } });

        expect(result.errors).toBeUndefined();
        const testStat = result?.data?.character.stats[0];

        expect(testStat.modifier).toEqual(Math.floor((testStat.value - 10) / 2));
    });

    it('return a list of characters', async () => {
        const source = `query {
            characters {
              _id
            }
        }`;

        const result = await gCall({ source });
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.characters as Character[];

        expect(resultData).toHaveLength(1);
    });
    it('removes a character by id from the database', async () => {
        const source = `mutation RemoveCharacter($removeCharacterId: String!) {
            removeCharacter(id: $removeCharacterId)
          }`;

        const result = await gCall({ source, variableValues: { removeCharacterId: createdId } });

        expect(result.errors).toBeUndefined();
        expect(result.data?.removeCharacter).toBe(true);
    });
    afterAll(async () => {
        if (conn) {
            conn.close();
        }
    });
});
