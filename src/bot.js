'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const CMD_DIR = './src/commands/';

/** The bot class */
class Bot {
    /**
     * Construct a Bot
     * @param {string} config Path to config file
     */
    constructor(config='../config.js') {
        // Setup bot
        this.client = new Discord.Client();
        this.config = require(config);
        /* 
         * Load all commands
         * Commands are sorted into several objects:
         *  commands: Stores command by their command characters
         *    ie, { '~' : [...], '' : [...], 'Cr': [...] }
         *  commands_by_category: Stores commands by their cateogry
         *    ie, { 'help' : [...], 'tpt': [...] }
         *  special_commands: Commands that have a should_run function
         *    Mostly used for hooks and other misc stuff
         */
        this.commands = {};
        this.commands_by_category = {};
        this.commands_l = [];
        this.special_commands = [];

        // All commands stored in commands folder
        this.reload();

        // Message handling
        this.client.on('message', async msg => {
            if (msg.author === this.client.user) // Prevent bot from responding to its own messages
                return;
            
            console.log(`[MESSAGE] ${msg.guild.name}/${msg.channel.name}/${msg.author.username}: ${msg.content}`);
    
            // Check special commands to run
            for (let cmd of this.special_commands) {
                if (cmd.should_run(msg)) {
                    cmd.run(msg, this, msg.content.split(' '));
                    return;
                }
            }

            // Run commands (yay)
            for (let prefix of Object.keys(this.commands)) {
                let temp = prefix === 'null' ? this.config.prefix : prefix;


                // Run the command as prefix matches. A null prefix defaults to
                // this.config.prefix, a '' prefix matches all content
                if (msg.content.startsWith(temp))
                    for (let cmd of this.commands[prefix]) {
                        // Sort all aliases from longest to shortest to avoid issues
                        // where aliases are a substring of another one
                        let names = cmd.alias.concat([cmd.name]).sort((a, b) => b.length - a.length);

                        for (let alias of names) {
                            if (msg.content.startsWith(temp + alias + ' ') || msg.content === temp + alias) {
                                 cmd.run(msg, this,
                                    msg.content.slice((temp + alias).length).trim().split(/ +/g).filter(x => x.length));
                                return;
                            }
                        }
                    }
            }
        });

        // Login
        console.log('Logging in...');
        this.client.login(this.config.token);
        console.log('Logged in! :D');
    }

  
    /**
     * Reload all commands
     */
    reload() {
        // Clear
        this.commands = {};
        this.commands_by_category = {};
        this.commands_l = [];
        this.special_commands = [];

        let files = fs.readdirSync(CMD_DIR);
        console.log(`Found ${files.length - 1} command files\n`);

        files.forEach(file => {
            if (file === 'index.js') return;
            delete require.cache[require.resolve('./commands/' + file)]; // Clear cache to reload
            let commands = require('./commands/' + file);

            if (commands.length) commands.forEach(x => this.addCommand(x));
            else this.addCommand(commands);
        });
    }

    /**
     * Adds a command to bot, use this instead of modifying commands
     * directly as it does extra sorting!
     * @param {Command} command Add command to bot
     */
    addCommand(command) {
        if (!command.exist) return; // Ignore disabled commands
        if (command.command_char === this.config.prefix)
            command.command_char = null; // Set to null to default to this.config.prefix for dynamic prefix changes

        // console.log('> Adding command', command.name);

        // Special hooks based on message content
        if (command.should_run) {
            this.special_commands.push(command);
            return;
        }
        
        if (!this.commands[command.command_char])
            this.commands[command.command_char] = [];
        if (!this.commands_by_category[command.category])
            this.commands_by_category[command.category] = [];

        this.commands[command.command_char].push(command);
        this.commands_by_category[command.category].push(command);
        this.commands_l.push(command);
    }
}

module.exports = Bot;