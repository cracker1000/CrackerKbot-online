const Command = require('./index.js');
const fs = require('fs');
const Discord = require('discord.js');
module.exports = [
// below 3 commands are for taking notes. Stored in info.txt.
// Cr n writes, c wipes and g retrieves the text.
 new Command(
        (msg, bot, args) => {
           const notetaken = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Note taken successfully.')
                .setTimestamp()
           let wordtoadd = args.slice(0).join(' ');
           const path = "src/filestorage/info.txt";
            msg.channel.send(notetaken);
       fs.appendFile(path,wordtoadd + '\r\n', function (err) {
        if (err) return console.log(err);
    });
        }, 'note', 'Adds a msg to a list', 'fun', 100, null, false, true, ['n']
    ),
          new Command(
        (msg, bot) => {
              const path = "src/filestorage/info.txt";
         const content = fs.readFileSync(path, 'utf-8');
         msg.channel.send(content);
        }, 'get note', 'Gets the list of all addded words', 'fun', 100, null, false, true, ['g']
    ),
      new Command(
        (msg, bot) => {
           const path = "src/filestorage/changelogs.txt";
         const content = fs.readFileSync(path, 'utf-8');
            let id1 = bot.client.channels.resolveID('311697121914912768'); //Tpt unofficial server.
           const notice1 = new Discord.MessageEmbed()
                .setColor('#4caf50')
                .setTitle(":shield: New Update :shield:")
                .setURL("https://powdertoy.co.uk")
                .setDescription(content);
            bot.client.channels.resolve(id1).send(notice1);
        }, 'update', 'Sends an update notification in #general', 'fun', 100, null, false, true, ['u']
    ),
      new Command(
        (msg, bot) => {
              const path = "src/filestorage/info.txt";
               fs.writeFile(path,"<starts here>" + '\r\n', function (err) {
        if (err) return console.log(err);
    });
         msg.channel.send("Notes cleared successfully");
        }, 'wipe note', 'clears the notes file.', 'fun', 100, null, false, true, ['c']
    ),
 new Command(
        (msg, bot,args) => {
    const embedst = new Discord.MessageEmbed()
        .setTitle('Start')
        .setColor(0x738BD7)
        .setURL(`https://Crackerkbot2.cracker1000.repl.run`)
    msg.channel.send(embedst)
        }
        , 'start', 'Provides link for starting the bot', 'bot', 100
    ),
    new Command(
        (msg, bot,args) => {
let nick = args.join(' ');
const nickc= new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Nickname changed to: '+ nick);
           msg.channel.send(nickc);
          bot.client.user.setUsername(nick);
        }, 'setnick', 'Changes the bot nick using discord API [Admin only]', 'bot', 100
    ),
        new Command(
        (msg, bot) => {
           var pingtest = Date.now() - msg.createdTimestamp + " ms";
            const ping = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Pong')
                .setDescription("Ping time: " +`${pingtest}`); 
           msg.channel.send(ping);
        }, 'ping', 'Responds to ping', 'bot'
    ),

       new Command(
        (msg, bot) => {
            const ping = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Pong')
                .setDescription("Ping?"); 
           msg.channel.send(ping);
        }, 'pong', 'Responds to pong', 'bot'
    ),
  
    new Command(
        (msg, bot) => {
            msg.channel.send('Attemting to reload...');
            bot.reload();
            msg.channel.send('Reload complete! ' + bot.commands_l.length + ' commands loaded.');
        }, 'reload', 'Reload all commands [admin only]', 'bot', 100, null, false, true, ['r']
    ),

   new Command(
        (msg, bot,args) => {
            msg.channel.send('Over and out...');
            msg.guild.leave();
        }, 'leave', 'Makes the bot leave a server.[admin only]', 'bot', 100, null, false, true,
    ),
  
    new Command(
        (msg, bot, args) => {
            msg.channel.send(args.join(' '));
        }, 'say', 'makes bot say something [perm req].', 'bot', 100
    ),

    new Command(
        async (message, bot, args) => {
            // Get the delete count, as an actual number.
            const deleteCount = parseInt(args[0], 10);

            // Ooooh nice, combined conditions. <3
            if (!deleteCount || deleteCount < 1 || deleteCount > 100)
                return message.reply('Please provide a number between 1 and 100 for the number of messages to delete');

            const fetched = await message.channel.messages.fetch ({ limit: deleteCount });
            message.channel.bulkDelete(fetched)
                .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        }, 'clear', 'Used for clearing messages from certain users, disabled for this server.', 'bot', 100
    ),
   new Command(
        (message, bot, args) => {
            let type = 'PLAYING';
            if (['WATCHING', 'PLAYING', 'LISTENING', 'STREAMING'].includes(args[0])) {
                type = args[0];
                args = args.slice(1);
            }
            let status = args.join(' ');
            message.channel.send('Status changed to ' + status + ' (Type: ' + type + ')');
          
            // PLAYING STREAMING LISTENING WATCHING Bots can't do CUSTOM_STATUS :(
            bot.client.user.setActivity(status, {
                type: type
            }).then()
              .catch(x => message.channel.send('Failed to set status: ' + x));
            //bot.client.user.setGame(status);
            //bot.client.user.setPresence({ activity: { name: 'Idk lol', type: 'PLAYING' }, status: 'online' })
            //  .then()
            //  .catch(x => message.channel.send('Failed to set status: ' + x));
        }, 'setstatus', 'sets the bots status [admin only]', 'bot', 100, null, false, true, ['sets']
    ),

    new Command(
        (message, bot, args) => {
            message.channel.send('Disabled successfully.').then(() => process.exit(1));
        }, 'stop', 'Shuts off the bot [perms required]', 'bot', 100
    )
];