import { graphql, GraphQLSchema } from 'graphql';

import { createSchema } from './createSchema';

interface Options {
    source: string;
    variableValues?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

let schema: GraphQLSchema;

const gCall = async ({ source, variableValues }: Options) => {
    if (!schema) {
        schema = await createSchema();
    }
    return graphql({
        schema,
        source,
        variableValues,
    });
};

export default gCall;
