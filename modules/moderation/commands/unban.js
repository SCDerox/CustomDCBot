const {confDir} = require('./../../../main');
const {MessageEmbed} = require('discord.js');
const {moderationAction} = require('../moderationActions');

module.exports.run = async function (client, msg, args) {
    const moduleConfig = require(`${confDir}/moderation/config.json`);
    const moduleStrings = require(`${confDir}/moderation/strings.json`);
    const message = await msg.channel.send('One sec...');
    if (!msg.member.roles.cache.find(r => moduleConfig['moderator-roles_level4'].includes(r.id))) return message.edit(moduleStrings['no_permissions'].split('%required_level%').join(4));
    let user = args[0];
    let reason = '';
    await args.shift(); // Removing tag/userid from arguments
    args.forEach(a => {
        reason = reason + ' ' + a;
    });
    if (reason.length === 0 && moduleConfig['require_reason']) return message.edit(moduleStrings['missing_reason']);
    moderationAction(client, 'unban', msg.member, user, reason).then(m => {
        if (m) {
            message.edit(`Done. Case-ID: #${m.actionID}`);
        } else message.edit('An error occured');
    });
};

module.exports.help = {
    'name': 'unban',
    'description': 'Unbans a member',
    'module': 'moderation',
    'aliases': ['unban']
};
module.exports.config = {
    'restricted': false,
    'args': true
};