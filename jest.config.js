/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'coverage',
                outputName: 'junit.xml',
            },
        ],
    ],
};
