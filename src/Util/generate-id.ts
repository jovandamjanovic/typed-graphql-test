const generate = (len: number) => {
    const getRandomChar = () =>
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')[Math.floor(Math.random() * 62)];

    let result = '';
    for (let index = 0; index < len; index++) {
        result += getRandomChar();
    }
    return result;
};

export default generate;
