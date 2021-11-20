const Command = require('./index.js');
const Discord = require('discord.js');

module.exports = [
    new Command(
        (msg, bot, args) => {
            let numArray = args.map(n => +n);
            let total = numArray.reduce((p, c) => p + c);
            msg.channel.send(total);
        }, 'add', 'Add numbers a + b + c...', 'math'
    ),
    new Command(
        (msg, bot, args) => {
            let numArray = args.map(n => +n);
            let total = numArray.reduce((p, c) => p - c);
            msg.channel.send(total);
        }, 'sub', 'Add numbers a - b - c...', 'math'
    ),
    new Command(
        (msg, bot, args) => {
            let numArray = args.map(n => +n);
            let total = numArray.reduce((p, c) => p * c);
            msg.channel.send(total);
        }, 'mul', 'Add numbers a * b * c...', 'math', 0, null, false, true, ['mult']
    ),
    new Command(
        (msg, bot, args) => {
            let numArray = args.map(n => +n);
            let total = numArray.reduce((p, c) => p / c);
            msg.channel.send(total);
        }, 'div', 'Divide numbers a / b / c...', 'math'
    )
];