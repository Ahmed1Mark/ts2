// interactions/send_msg_post.js

// دالة لمعالجة التفاعل sendmsgpost
async function handleSendMsgPost(interaction, hasClaimPermission) {
    // التحقق من صلاحيات المستخدم
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to take this action', ephemeral: true });
        return;
    }
    
    // قم بتنفيذ الإجراء المرتبط بإرسال رسالة عادية
    const msg = await interaction.reply({ content: 'Enter the speech to send the message', ephemeral: true });

    // استجابة للرسالة القادمة من المستخدم
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    collector.on('collect', async m => {
        const content = m.content.trim(); // استخراج النص المدخل من المستخدم
        try {
            await interaction.channel.send({ content: content }); // إرسال الرسالة بالشات ليروها الجميع
            await m.delete(); // حذف رسالة المستخدم
        } catch (error) {
            console.error('An error occurred while trying to send the message:', error);
            await interaction.followUp({ content: 'An error occurred while trying to send the message', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp({ content: 'The text was not provided to send the message in time', ephemeral: true });
            msg.delete(); // حذف رسالة الطلب الأصلية
        }
    });
}

// تصدير الدالة لمعالجة التفاعل sendmsgpost
module.exports = {
    handleSendMsgPost
};
