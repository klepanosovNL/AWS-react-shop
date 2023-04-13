'use strict'

const {BOOKS} = require("../../mocks/books");
const {HEADERS, STATUS_CODES} = require("../../const");

module.exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;
        const product = await BOOKS.find((element) => element.id === +id);
        const statusCode = product ? STATUS_CODES.SUCCESS : STATUS_CODES.NOT_FOUND;
        const body = product ? JSON.stringify(product) : `Cannot find product with id: ${id}`

        return {
            statusCode,
            headers: HEADERS,
            body
        }
    } catch (e) {
        console.log('error ', e);

        return {
            statusCode: STATUS_CODES.SERVER_ERROR,
            headers: HEADERS,
            body: `Oopps we have some error: ${e}`
        }
    }
};


