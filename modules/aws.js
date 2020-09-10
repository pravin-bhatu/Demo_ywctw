var aws = require('aws-sdk');

aws.config.loadFromPath('./config/aws.json');

module.exports = aws;
