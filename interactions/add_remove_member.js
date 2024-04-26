// interactions/add_remove_member.js

// Function to handle adding a member to the ticket
async function handleAddMember(interaction, guild) {
    // Defer the interaction to prevent timeout
    await interaction.deferUpdate();

    try {
        const filter = m => m.author.id === interaction.user.id;
        const addMemberPrompt = await interaction.followUp({ content: 'Please mention the person you want to add "<@user_id>" This is an example of adding a person', ephemeral: true });
        const collectedMessages = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

        const memberIdOrMention = collectedMessages.first().content.trim();
        const memberToAdd = guild.members.cache.get(memberIdOrMention.replace(/\D/g, ''));

        if (!memberToAdd) throw new Error('Member not found.');

        await interaction.channel.permissionOverwrites.create(memberToAdd, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
        });

        await collectedMessages.first().delete();
        await addMemberPrompt.delete();
        await interaction.reply({ content: `Member ${memberToAdd.user.tag} has been added to the ticket.`, ephemeral: true });

        // Send message directly after adding member successfully
        await interaction.channel.send('The person has been added successfully.');

    } catch (error) {
        console.error('Error adding member:', error.message);
        await interaction.reply({ content: 'Failed to add member. Please make sure you entered a valid ID or mention.', ephemeral: true });
    }
}

// Function to handle removing a member from the ticket
async function handleRemoveMember(interaction, guild) {
    // Defer the interaction to prevent timeout
    await interaction.deferUpdate();

    try {
        const filter = m => m.author.id === interaction.user.id;
        const removeMemberPrompt = await interaction.followUp({ content: 'Please mention the person you want to remove "<@user_id>" This is an example of removing a person', ephemeral: true });
        const collectedMessages = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

        const memberIdOrMention = collectedMessages.first().content.trim();
        const memberToRemove = guild.members.cache.get(memberIdOrMention.replace(/\D/g, ''));

        if (!memberToRemove) throw new Error('Member not found.');

        await interaction.channel.permissionOverwrites.delete(memberToRemove);

        await collectedMessages.first().delete();
        await removeMemberPrompt.delete();
        await interaction.reply({ content: `Member ${memberToRemove.user.tag} has been removed from the ticket.`, ephemeral: true });

        // Send message directly after removing member successfully
        await interaction.channel.send('The person has been successfully removed.');

    } catch (error) {
        console.error('Error removing member:', error.message);
        await interaction.reply({ content: 'Failed to remove member. Please make sure you entered a valid ID or mention.', ephemeral: true });
    }
}

// Export the functions
module.exports = {
    handleAddMember,
    handleRemoveMember
};
