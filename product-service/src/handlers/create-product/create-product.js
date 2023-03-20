"use strict";

const {DynamoDB} = require('aws-sdk');
const {HEADERS, STATUS_CODES} = require("../../const");

const dynamo = new DynamoDB.DocumentClient({region: 'eu-west-1'});

module.exports.handler = async (event) => {
    const {title, description, price, count, product_id} = JSON.parse(event.body || "{}");
    const productItem = {
        product_id,
        title,
        description,
        price,
    };
    const stockItem = {
        product_id,
        count,
    };

    try {
        await dynamo.transactWrite({
                TransactItems: [
                    {
                        Put: {
                            Item: productItem,
                            TableName: process.env.PRODUCT_TABLE_NAME,
                        },
                    },
                    {
                        Put: {
                            Item: stockItem,
                            TableName: process.env.STOCK_TABLE_NAME,
                        },
                    },
                ],
            })
            .promise();

        return {
            statusCode: STATUS_CODES.SUCCESS_CREATED,
            headers: HEADERS,
            body: JSON.stringify({
                product_id,
                title,
                description,
                price,
                count
            }),
        };
    } catch (error) {
        return {
            statusCode: STATUS_CODES.SERVER_ERROR,
            body: JSON.stringify(error),
        };
    }
}
