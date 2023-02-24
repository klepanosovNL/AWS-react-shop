'use strict'

const {BOOKS} = require("../../mocks/books");
const {HEADERS, STATUS_CODES} = require("../../const");

module.exports.handler = async () => ({
    statusCode: STATUS_CODES.SUCCESS,
    headers: HEADERS,
    body: JSON.stringify(BOOKS)
});


