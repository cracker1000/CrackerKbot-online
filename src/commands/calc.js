const Command = require('./index.js');
const Discord = require('discord.js');

const NUM_RE = /(-|)\d+(\.\d+|)(e(-|)\d+|)/g;
const NUM_DOUBLE_PAREN_RE = /\(\((-|)\d+(\.\d+|)(e(-|)\d+|)\)\)/g;
const PAREN_RE = /\(([^()]*)\)/g;

const EXP_RE = /\((-|)\d+(\.\d+|)(e(-|)\d+|)\)\^\((-|)\d+(\.\d+|)(e(-|)\d+|)\)/g;
const MUL_DIV_MOD_RE = /\((-|)\d+(\.\d+|)(e(-|)\d+|)\)[\/*%]\((-|)\d+(\.\d+|)(e(-|)\d+|)\)/g;
const ADD_SUB_RE = /\((-|)\d+(\.\d+|)(e(-|)\d+|)\)[+-]\((-|)\d+(\.\d+|)(e(-|)\d+|)\)/g;

const AND_RE = /\((-|)\d+(\.\d+|)(e(-|)\d+|)\)\&\((-|)\d+(\.\d+|)(e(-|)\d+|)\)/g;
const OR_RE = /\((-|)\d+(\.\d+|)(e(-|)\d+|)\)\|\((-|)\d+(\.\d+|)(e(-|)\d+|)\)/g;
const NOT_RE = /\~\((-|)\d+(\.\d+|)(e(-|)\d+|)\)/g;

function stripParen(x) {
    return x.substring(1, x.length - 1);
}

let math_funcs = 'cos,sin,tan,atan,acos,atan,acosh,atanh,asinh,sinh,cosh,tanh,exp,sqrt,abs,random,pow,log,hypot,ceil,floor,round,log10,log2,max,min,sign,atan2'.split(',');
let FUNCTIONS = [];
for (let f of math_funcs)
    FUNCTIONS.push({ name: f, func : Math[f] });

FUNCTIONS = FUNCTIONS.sort((a, b) => b.name.length - a.name.length);
let VARIABLES = [
    { name: 'PI', value: '3.14159265358979323' },
    { name: 'E',  value: '2.7182818284590452' }
].sort((a, b) => b.name.length - a.name.length);

function solve(exp) {
    exp = exp.replace(/\s/g, '').replace(/-\(/g, '-1*(');
    for (let varname of VARIABLES)
        exp = exp.replace(new RegExp(varname.name, 'g'), varname.value);

    // Final expression, just (number)
    if (exp.replace(NUM_RE, x => `(${x})`) === `(${exp})`)
        return +exp;

    let iterations = 0;

    while (exp.replace(NUM_RE, x => `(${x})`) !== `(${exp})`) {
        let pexp = 0;
        while (pexp != exp) {
            pexp = exp;
            // Solve paren first, ie 2 * (3 + 5) => 2 * 8
            exp = exp.replace(PAREN_RE, x => `${solve(stripParen(x))}`);
        }

        // Rewrap numbers after solving, ie 2 * 8 => (2) * (8)
        exp = exp.replace(NUM_RE, x => `(${x})`);
        while (exp.match(NUM_DOUBLE_PAREN_RE))
            exp = exp.replace(NUM_DOUBLE_PAREN_RE, stripParen);

        // Solve functions
        for (let fname of FUNCTIONS) {
            let regex = new RegExp('(' + fname.name + '\\(.*?\\))', 'g');
            while (exp.match(regex))
                exp = exp.replace(regex, x => {
                    let t = x.replace(')', '').split('(')[1].replace('(', '');
                    console.log(x, t, fname.func(+t))
                    return `(${fname.func(+t)})`;
                });
        }
      
        exp = exp.replace(/\)\(-/g, ')+(-'); // Fix for negative numbers

        // Solve exponents
        while (exp.match(EXP_RE))
            exp = exp.replace(EXP_RE, x => {
                let t = x.split('^').map(stripParen);
                return `(${Math.pow(+t[0], +t[1])})`;
            });
        // Solve multiplication / division / mod
        while (exp.match(MUL_DIV_MOD_RE))
            exp = exp.replace(MUL_DIV_MOD_RE, x => {
                let t = x.split(/[*\/%]/g).map(stripParen);
                if (x.includes('/'))
                    return `(${+t[0] / +t[1]})`;
                if (x.includes('*'))
                    return `(${+t[0] * +t[1]})`;
                return `(${+t[0] % +t[1]})`;
            });
        // Solve addition / subtraction
        while (exp.match(ADD_SUB_RE))
            exp = exp.replace(ADD_SUB_RE, x => {
                let t = x.split(/[-+]/g);
                t = t.filter(x => x !== '(').map(x => {
                    if (x.includes('(') && x.includes(')'))
                        return stripParen(x);
                    if (x.includes(')'))
                        return '-' + x.substring(0, x.length - 1);
                    if (x.includes('('))
                        return '-' + x.substring(1);
                    return x;
                });
                return x.includes('+') ?
                    `(${+t[0] + +t[1]})` :
                    `(${+t[0] - +t[1]})`;
            });

        // Bitwise AND
        while (exp.match(AND_RE))
            exp = exp.replace(AND_RE, x => {
                let t = x.split(/\&/g).map(stripParen);
                return `(${+t[0] & +t[1]})`;
            });
        // Bitwise OR
        while (exp.match(OR_RE))
            exp = exp.replace(OR_RE, x => {
                let t = x.split(/\|/g).map(stripParen);
                return `(${+t[0] | +t[1]})`;
            });
        // Bitwise NOT
        while (exp.match(NOT_RE))
            exp = exp.replace(NOT_RE, x => {
                let t = stripParen(x).replace('(', '');
                return `(${~+t})`;
            });

        // Check for invalid or too long of an expression
        if (iterations > 10)
            break;
        iterations++;
    }
    return +exp.replace(/\(/g, '').replace(/\)/g, '');
}

module.exports = [
    new Command(
        (msg, bot, args) => {
            msg.channel.send(solve(args.join('')));
        }, 'calc', 'calc <expr> - Calculate an expression, use PI and E for variables.', 'math'
    )
];