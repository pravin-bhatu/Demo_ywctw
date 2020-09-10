// Module to pass a Parse instance around.

const Parse = require('parse/node');

Parse.initialize(process.env.PARSE_APP_ID || 'T6HAEsetwja2ojRQIVCyqaxv0S8wZ3Z8Ew7OT4M2');
Parse.serverURL = process.env.PARSE_SERVER_URL || 'https://ywctw-parse.herokuapp.com/';
Parse.masterKey = process.env.PARSE_MASTER_KEY || 'pl5nCue4c4McygiVc6Hi20J1TFT5yDw3k38YQViA';

module.exports = Parse;
