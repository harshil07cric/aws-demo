const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client
const dynamodb = new DynamoDB.DocumentClient();
const TABLE_NAME = 'Events';

exports.handler = async (event) => {
    try {
        // Parse incoming request body
        const body = JSON.parse(event.body);
        const { principalId, content } = body;

        // Create event object to save
        const eventItem = {
            id: uuidv4(),
            principalId,
            createdAt: new Date().toISOString(),
            body: content
        };

        // Save to DynamoDB
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: eventItem
        }).promise();

        // Return response
        return {
            statusCode: 201,
            body: JSON.stringify({
                statusCode: 201,
                event: eventItem
            })
        };

    } catch (error) {
        console.error('Error saving event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
                error: error.message
            })
        };
    }
};
