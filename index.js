'use strict';
const keepAlive = require('./server');
// Actual code
const Bot = require('./src/bot.js');
const bot = new Bot();
keepAlive();
