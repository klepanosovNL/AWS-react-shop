'use strict'

const {DynamoDB} = require('aws-sdk');
const {joinTableById} = require("../../utils/utils");
const {HEADERS, STATUS_CODES} = require("../../const");

module.exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;
        const dynamo = new DynamoDB.DocumentClient({region: 'eu-west-1'});
        const { Items: products } = await dynamo.scan(({TableName: process.env.PRODUCT_TABLE_NAME})).promise();
        const { Items: stocks } = await dynamo.scan(({TableName: process.env.STOCK_TABLE_NAME})).promise();
        const mergedProducts = joinTableById(products, stocks);
        const product = await mergedProducts.find(({id}) => id === id);
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
