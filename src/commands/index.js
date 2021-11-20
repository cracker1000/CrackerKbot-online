'use strict';

/** A command object */
class Command {
    /**
     * Construct a command
     * @param {function} func Function to run, accepts message, bot, args as parameters
     * @param {string} name Name of command
     * @param {string} help_text Help text
     * @param {string} category Category
     * @param {number} perm=0 Permission level, user must have at least this number to run
     * @param {string} command_char=null Alternate command char for command, set to null for default bot cmdchr
     * @param {boolean} auto_help=true Return help text if command errors
     * @param {boolean} show=true Show the bot comamnd in listings and help
     * @param {array} alias=[] Alias names for command, ie ['calc', 'calculator']
     * @param {boolean} exist=true If exist = false command will pretend to be non-existant
     * @param {function} should_run=null Function, takes msg as parameter and returns T/F if
     *       the command should be run on the message
     */
    constructor(func, name, help_text, category, perm=0, command_char=null, 
            auto_help=false, show=true, alias=[], exist=true, should_run=null) {
        this.func = func;
        this.name = name;
        this.help_text = help_text;
        this.category = category;
        this.perm = perm;
        this.command_char = command_char;
        this.auto_help = auto_help;
        this.show = show;
        this.alias = alias;
        this.exist = exist;
        this.should_run = should_run;
    }

    /**
     * Run the command
     * @param {Message} message Discord message
     * @param {Bot} bot Bot object
     * @param {array} args Arguments
     */
    run(message, bot, args) {
        if (!this.exist) return;

        // Insufficent permissions to run
        let uperm = (bot.config.perm[message.author.id] || 0);
  if (uperm < this.perm && !message.member.roles.cache.find(role => role.name =='name'))
         {
            message.channel.send(`You don't have the permission to use this command!`);
            return;
        }

        try { this.func(message, bot, args); }
        catch(e) {
            console.log(e);
            if (this.auto_help)
                message.reply(`**${this.name}:** ${this.help_text}`);
        }
    }
}

module.exports = Command;