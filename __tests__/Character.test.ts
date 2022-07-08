import { graphql, GraphQLSchema } from 'graphql';
import { Connection } from 'mongoose';
import { buildSchema } from 'type-graphql';
import CharacterResolver from '../src/Resolvers/Character';
import { Character, CharacterModel, NewCharacterInput } from '../src/Types/Character';
import { testConnection } from '../testUtils/testConn';

describe('Character Resolver', () => {
    let schema: GraphQLSchema;
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
        CharacterModel.remove({});
        schema = await buildSchema({ resolvers: [CharacterResolver] });
    });
    it('adds a new character to the database', async () => {
        const mutation = `mutation AddCharacter($newCharacter: NewCharacterInput!) {
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

        const result = await graphql(schema, mutation, null, null, { newCharacter: testCharacter });
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.addCharacter as Character;

        expect(resultData._id).toBeTruthy();
        createdId = resultData._id;
        expect(resultData.name).toEqual(testCharacter.name);
        expect(resultData.description).toEqual(testCharacter.description);
        expect(resultData.stats).toHaveLength(6);
    });
    it('returns a single character by id from the database', async () => {
        const query = `query Character($characterId: String!) {
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

        const result = await graphql(schema, query, null, null, { characterId: createdId });
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.character as Character;

        expect(resultData.name).toEqual(testCharacter.name);
        expect(resultData.description).toEqual(testCharacter.description);
        expect(resultData.stats).toHaveLength(6);
    });
    it('fails to find a character with wrong id', async () => {
        const query = `query Character($characterId: String!) {
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

        const result = await graphql(schema, query, null, null, { characterId: 'come invalid id' });
        expect(result.data).toBeNull();
        expect(result.errors).toHaveLength(1);
        expect(result.errors?.[0].message).toEqual('Character not found!');
    });
    it('return a list of characters', async () => {
        const query = `query {
            characters {
              _id
              name
              description
              stats {
                name
                value
              }
            }
        }`;

        const result = await graphql(schema, query);
        expect(result.errors).toBeUndefined();

        const resultData = result.data?.characters as Character[];

        expect(resultData).toHaveLength(1);
    });
    it('removes a character by id from the database', async () => {
        const mutation = `mutation RemoveCharacter($removeCharacterId: String!) {
            removeCharacter(id: $removeCharacterId)
          }`;

        const result = await graphql(schema, mutation, null, null, { removeCharacterId: createdId });

        expect(result.errors).toBeUndefined();
        expect(result.data?.removeCharacter).toBe(true);
    });
    afterAll(async () => {
        if (conn) {
            conn.close();
        }
    });
});
