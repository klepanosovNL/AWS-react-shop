'use strict'

// const AWS = require('aws-sdk');
const { S3 } = require('@aws-sdk/client-s3');
const csv = require('csv-parser');
const {STATUS_CODES} = require("../../../const");

module.exports.handler = async (event) => {
    try {
        const s3 = new S3({ region: 'eu-west-1' });
        const params = {
            Bucket: process.env.UPLOAD_BUCKET_NAME,
            Key: event.Records[0].s3.object.key,
        };
        const results = [];

        const { Body } = await s3.getObject(params);

        Body
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('error', (e) => {
                console.log('Failed to parse file ', e);
            })
            .on('end', () => console.log('results: ',results));

        await s3.copyObject({
            Bucket: params.Bucket,
            CopySource: `${params.Bucket}/${params.Key}`,
            Key: params.Key.replace('uploaded', 'parsed'),
        });
        await s3.deleteObject(params);

    } catch (error) {
        console.log('your error: ', error);

        return ({
            statusCode: STATUS_CODES.SERVER_ERROR,
            body: JSON.stringify(error),
        })
    }
};
