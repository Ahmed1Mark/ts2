// interactions/send_msg_embed.js

// دالة لمعالجة التفاعل sendmsgembed
async function handleSendMsgEmbed(interaction, hasClaimPermission) {
    // التحقق من صلاحيات المستخدم
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to take this action', ephemeral: true });
        return;
    }
    
    // قم بتنفيذ الإجراء المرتبط بإرسال رسالة بـ أمبيد
    const msg = await interaction.reply({ content: 'Enter the speech to send the message using Embed', ephemeral: true });

    // استجابة للرسالة القادمة من المستخدم
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    collector.on('collect', async m => {
        const content = m.content.trim(); // استخراج النص المدخل من المستخدم
        try {
            await sendEmbedMessage(interaction, content); // استدعاء دالة لإرسال الرسالة بـ Embed
            await interaction.deleteReply(); // حذف رسالة الرد الأصلية
            await m.delete(); // حذف رسالة المستخدم
        } catch (error) {
            console.error('An error occurred while trying to send the message with Embed:', error);
            await interaction.followUp({ content: 'An error occurred while trying to send the message with Embed', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp({ content: 'The text was not provided to send the message to Ambed in time', ephemeral: true });
            msg.delete(); // حذف رسالة الطلب الأصلية
        }
    });
}

// دالة لإرسال رسالة بـ Embed
async function sendEmbedMessage(interaction, content) {
    // هنا يمكنك تنسيق الرسالة كما تريد
    const embed = {
        description: content,
        color: '#2c2c34',
    };

    await interaction.channel.send({ embeds: [embed] });
}

// تصدير الدالة لمعالجة التفاعل sendmsgembed
module.exports = {
    handleSendMsgEmbed
};
