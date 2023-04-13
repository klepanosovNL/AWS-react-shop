'use strict'

const {DynamoDB} = require('aws-sdk');
const {HEADERS, STATUS_CODES} = require("../../const");
const {joinTableById} = require("../../utils/utils");

module.exports.handler = async () => {
    try {
        const dynamo = new DynamoDB.DocumentClient({region: 'eu-west-1'});
        const { Items: products } = await dynamo.scan(({TableName: process.env.PRODUCT_TABLE_NAME})).promise();
        const { Items: stocks } = await dynamo.scan(({TableName: process.env.STOCK_TABLE_NAME})).promise();
        const mergedProducts = joinTableById(products, stocks);
        console.log('products ', products);
        console.log('stock ', stocks);
        console.log('mergedProducts ', mergedProducts);

        return ({
            statusCode: STATUS_CODES.SUCCESS,
            headers: HEADERS,
            body: JSON.stringify(mergedProducts)
        })
    } catch (e) {
        return {
            statusCode: STATUS_CODES.SERVER_ERROR,
            body: JSON.stringify('some error'),
        };
    }
};
