'use strict'

const AWS = require('aws-sdk');
const {HEADERS, STATUS_CODES} = require("../../../const");

module.exports.handler = async (event) => {
    const { queryStringParameters } = event;
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    try {
        if (!queryStringParameters?.name) throw new Error('name cannot be empty');

        const params = {
            Bucket: process.env.UPLOAD_BUCKET_NAME,
            Key: `uploaded/${queryStringParameters.name}`,
        };
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);

        return ({
            statusCode: STATUS_CODES.SUCCESS_CREATED,
            headers: HEADERS,
            body: JSON.stringify(signedUrl),
        });
    } catch (error) {
        console.log('your error: ', error);

        return ({
            statusCode: STATUS_CODES.SERVER_ERROR,
            body: JSON.stringify(error),
        })
    }
};
