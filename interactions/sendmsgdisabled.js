// interactions/sendmsgdisabled.js
const { Permissions } = require('discord.js');

// دالة لمعالجة التفاعل sendmsgdisabled
async function handleSendMsgDisabled(interaction, channel) {
    try {
        // جلب الصلاحيات الحالية لـ @everyone في القناة
        const everyonePermissions = channel.permissionOverwrites.get(channel.guild.roles.everyone);

        // إذا لم يكن لـ @everyone صلاحية إرسال الرسائل، نرسل رسالة تبليغ
        if (!everyonePermissions || !everyonePermissions.allow.has(Permissions.FLAGS.SEND_MESSAGES)) {
            await interaction.reply({
                content: `@everyone already can't send messages in this channel.`, ephemeral: true
            });
            return;
        }

        // تعديل صلاحيات @everyone في القناة
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SEND_MESSAGES: false
        });

        await interaction.reply({
            content: `Sending messages disabled for @everyone in this channel`, ephemeral: true
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'An error occurred while disabling sending messages', ephemeral: true
        });
    }
}

// تصدير الدالة لمعالجة التفاعل sendmsgdisabled
module.exports = {
    handleSendMsgDisabled
};
