const Command = require('./index.js');
const Discord = require('discord.js');
const ud = require('relevant-urban');
const moment = require('moment');

module.exports = [
    new Command(
        (msg, bot,) => {
           const save = new Discord.MessageEmbed()
                .setColor('#4caf50')
                .setTitle('Powdertoy saves')
                .setURL(`https://powdertoy.co.uk/User/Saves.html?Name=` +`${msg.author.username}`)
                        .setDescription('Click the link above\n'+ `${msg.author.username}`);
            msg.channel.send(save);
        }, 'mysave', 'Creates a link that directs to your powdertoy saves page.', 'general'
    ),

    new Command(
        (message, bot, args) => {
            let id1 = bot.client.channels.resolveID('311697121914912768'); //Tpt unofficial server.
            message.channel.send(bot.client.channels.resolve(id1));
          let mmsg = args.join(' ');
            bot.client.channels.resolve(id1).send(mmsg);
        }, 'm', 'Sends message in specified channel ids', 'general', 100, null, false, false
    ),
    
        new Command(
        (message, bot, args) => {
            let id12 = bot.client.channels.resolveID('805095072680640552'); //Other servers
            message.channel.send(bot.client.channels.resolve(id12));
          let mmsg = args.join(' ');
            bot.client.channels.resolve(id12).send(mmsg);
        }, 'm2', 'Sends message in specified channel ids', 'general', 100, null, false, false
    ),
    
    new Command(
        (message, bot) => {
            let member = message.mentions.members.first() || message.member;
            let user = message.mentions.users.first() || message.author;
            const info = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Showing your info.')
                .setURL('https://discord.js.org/')
                .setImage(message.author.avatarURL())
                .setTimestamp()
                .addField('Joined at:', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                .addField("Account Created On:", `${moment.utc(user.createdAt).format("dddd, MMMM Do YYYY")}`, true) 
                .addField('Current Status:', member.presence.status, true)

               .addField('Roles:', member.roles.cache.map(r => `${r}`).join(' | '))
               
                .setDescription(`Your username: ${user.tag}\n` +
                    `Your ID: ${message.author.id} \n` +
                    `Server name: ${message.guild.name}\n` +
                    `Total members: ${message.guild.memberCount}\n`);
            message.channel.send(info);
        }, 'info', 'Discord user info', 'general'
    ),
    new Command(
        async (message, bot, args) => {
            if (!args.length) return message.channel.send('Specify a word');
            let defin = await ud(args.join(' ')).catch(() => {
                message.channel.send('Word not found');
                return;
            });

            let embed = new Discord.MessageEmbed()
                .setTitle(defin.word)
                .setURL(defin.urbanURL)
                .setDescription(defin.definition.length > 2048 ?
                    defin.definition.slice(0, 2044) + '...' : defin.definition)
                .addField('Example', defin.example)
                .addField('Author', defin.author)
                .setColor(bot.config.color);
                 if (message.member.roles.cache.some(role => role.name === 'Member')) {
                   message.channel.send(embed);
               }
                      else 
                    {
 msg.channel.send("Access denied, Member role required.");
                  }
           
        }, 'define', `defines a word, usage Cr define [word]`, 'general'
    ),
    new Command(
        (message, bot, args) => {
            let help;    

            if (args.length && args[0].length) {
                let c = null;  // Find the command
                for (let c2 of bot.commands_l) {
                    if (c2.name === args[0] || c2.alias.includes(args[0])) {
                        c = c2;
                        break;
                    }
                }

                // Command not found
                if (!c) {
                    message.channel.send('No command called ' + args[0]);
                    return;
                }
                help = new Discord.MessageEmbed()
                    .setColor('#FDD017')
                    .setTitle('Welcome to help section')
                    .setURL('https://discord.js.org/')
                    .setDescription('Help for ' + args[0])
                    .addField('Help text', c.help_text || 'No help text')
                    .addField('Category:', c.category || 'No category', true)
                    .addField('Perm:', c.perm, true)
                    .addField('Alias(es):', c.alias.join(', ') || 'No alias', true);
            }
            else {
                help = new Discord.MessageEmbed()
                    .setColor('#FDD017')
                    .setTitle('Welcome to help section')
                    .setURL('https://discord.js.org/')
                    .setDescription('Save ids start with ~ or id: or ID: sign.\n\n'
                        + `Type ${bot.config.prefix}help <command> to show help for a command or\n`
                        + `${bot.config.prefix}list <category> to list all commands in a category`);
            }

          
            message.channel.send(help);
        }, 'help', 'Get help for a command', 'general'
    ),
    new Command(
        (message, bot, args) => {
            let help = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Welcome to list section')
                .setURL('https://discord.js.org/')
                .setDescription(`Type ${bot.config.prefix}help <command> to show help for a command or\n`
                    + `${bot.config.prefix}list <category> to list all commands in a category`);

            // List all categories
            if (!args.length || !args[0].trim().length) {
                let c = Object.keys(bot.commands_by_category);

                for (let i = 0; i < c.length; i++)
                    help = help.addField(`${i + 1}) ${c[i]}`,
                        bot.commands_by_category[c[i]]
                            .filter(x => x.show && x.exist)
                            .map(x => x.name).slice(0, 5).join(', ')
                        + (bot.commands_by_category[c[i]].length > 5 ? '...' : ''));
            }

            // Invalid
            if (args.length && !bot.commands_by_category[args[0]]) {
                message.channel.send('No category called ' + args[0]);
                return;
            }

            // List all commands in category
            if (args.length && args[0].length) {
                let c = bot.commands_by_category[args[0]].filter(x => x.show && x.exist);

                for (let i = 0; i < c.length; i++)
                    help = help.addField(`${i + 1}) ${c[i].name}:`, c[i].help_text || 'No help text');
            }
            message.channel.send(help);
        }, 'list', 'list <category> - List commands in a category', 'general'
    )
];