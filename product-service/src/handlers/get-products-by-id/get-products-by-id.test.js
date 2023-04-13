const {handler} = require('./get-products-by-id.js');
const {HEADERS, STATUS_CODES} = require("../../const");

describe('get-products-by-id', () => {
    test('get product by id', async () => {
        const data = await handler({ pathParameters: { id: 1 } })
        const expectedData = {
            name: "Book 1",
            price: 10,
            id: 1
        };

        expect(data).toEqual({
            body: JSON.stringify(expectedData),
            headers: HEADERS,
            statusCode: STATUS_CODES.SUCCESS
        })
    })
    test('Cannot find product', async () => {
        const data = await handler({ pathParameters: { id: 11 } })

        expect(data).toEqual({
            body: 'Cannot find product with id: 11',
            headers: HEADERS,
            statusCode: STATUS_CODES.NOT_FOUND
        })
    })
})
