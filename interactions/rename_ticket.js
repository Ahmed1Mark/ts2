// interactions/rename_ticket.js

// دالة لمعالجة التفاعل rename_ticket
async function handleRenameTicket(interaction, hasClaimPermission) {
    // التحقق من صلاحيات المستخدم
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to take this action', ephemeral: true });
        return;
    }

    // تأجيل الرد حتى يتم معالجة التفاعل
    await interaction.deferUpdate();

    // إرسال رسالة لطلب اسم جديد للتذكرة
    const newNamePrompt = await interaction.followUp({ content: 'Please enter a new ticket name', ephemeral: true });

    // استجابة للرسالة القادمة من المستخدم
    const filter = m => m.author.id === interaction.user.id;
    try {
        const collectedMessages = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

        const newName = collectedMessages.first().content.trim();
        await interaction.channel.setName(newName);

        // حذف الرسائل التي تم جمعها ورسالة الطلب الأصلية
        await collectedMessages.first().delete();
        await newNamePrompt.delete();

        // رد برسالة تأكيد تغيير اسم القناة
        await interaction.reply({ content: 'Channel renamed successfully.', ephemeral: true });
    } catch (error) {
        // التعامل مع الأخطاء ورد الرسالة المناسبة
        console.error('Error:', error.message);
        await interaction.reply({ content: 'Channel renaming has timed out.', ephemeral: true });
    }
}

// تصدير الدالة لمعالجة التفاعل rename_ticket
module.exports = {
    handleRenameTicket
};
