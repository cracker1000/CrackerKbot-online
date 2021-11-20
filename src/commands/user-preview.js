const Command = require('./index.js');
const Discord = require('discord.js');
const request = require('request');
const he = require('he');

const is_msg = msg => msg.content.trim().split(' ').length === 2 && msg.content.toLowerCase().startsWith('user ');

module.exports = new Command(
    (msg, bot) => {
        let name = msg.content.trim().split(' ')[1];
 
        request('https://powdertoy.co.uk/User.html?Name=' + name, {}, (err, res, body) => {
            if (err || body.includes('Status 404')) {
                const previewerr2 = new Discord.MessageEmbed()
                  .setColor('#FDD017')
                  .setTitle('Unable to show preview.')
                  .setDescription("Cannot find user maybe it's invalid?")
                   msg.channel.send(previewerr2);
                return;
            }
      
            let data = {};
            let temp = body.match(/<label>(.*?)<\/label>\s*<span>(.*?)<\/span>/g)
              .map(x => x.replace('<label>', '').replace('</span>', '').split('</label> <span>'))
              .forEach(x => data[x[0].replace(':', '')] = x[1]);
          
            let img = body.match(/<div class="ProfilePicture">[\s\S]*<img src="(.*?)"/)[1];
            if (!img.startsWith('http'))
                img = 'https://powdertoy.co.uk' + img;

            let name = he.decode(body.match(/class="SubmenuTitle">(.*?)<\/h1>/)[1]);
            let bio = data.Biography;
            let age = data.Age;
            let website = data.Website;
            let registered = data.Registered;
            let location = data.Location;
            
            let count = data['Total Saves'] || '0';
            let avg = data['Average Score'] || '0';
            let highest = data['Highest Score'] || '0';
            let reputation = data['Reputation'] || '0';

            let user = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setAuthor('Powdertoy user info')
                .setTitle('Open in browser')
                .setURL('https://powdertoy.co.uk/User.html?Name=' + name)
                .setImage(img, true)
                .setDescription('')
                .addField('Name:', he.decode(name), true);
          
          if (bio) user = user.addField('Bio:', he.decode(bio).replace(/<br\/>/g, '\n').replace(/<br>/g, '\n'), true);
          if (age) user = user.addField('Age:', he.decode(age), true);
          if (website) user = user.addField('Website:', he.decode(website.match(/href="(.*?)"/)[1]), true);
          if (location) user = user.addField('Location:', he.decode(location), true);
          
          user = user
           .setFooter("Requested by "+ `${msg.author.username}`)
                .addField('Registered:', registered , true)
                .addField('Save count:', count , true)
                .addField('Avg. score:', avg, true)
                .addField('Highest score:', highest, true)
                .addField('Reputation:', reputation, true)

               if (msg.member.roles.cache.some(role => role.name === 'Member')) {
                msg.channel.send(user);
               }
                      else 
                    {
 msg.channel.send("Access denied, Member role required.");
                  }
        });
    }, 'user-preview', 'Preview users with User <username>', 'hidden', 0, '',
    false, true, [], true, is_msg
);