const { MessageButton, MessageActionRow } = require('discord.js');

// Function to handle the claim_ticket interaction
async function handleClaimTicket(interaction, hasClaimPermission) {
    // Check if the member has permission to claim
    const member = interaction.member;
    if (!hasClaimPermission(member)) {
        await interaction.reply({ content: 'You do not have the authority to take this action', ephemeral: true });
        return;
    }

    // Get the user who clicked the button
    const claimTicket = interaction.user;

    // Send a confirmation message in the chat
    const claimMessage = `This Ticket Was Claimed By ${claimTicket}`;
    await interaction.channel.send(claimMessage);

    // Defer the interaction to prevent timeout
    await interaction.deferUpdate();

    // Send a confirmation message and edit the existing embed
    const embed = interaction.message.embeds[0];
    embed.fields.find(field => field.name === '> Claimed By').value = `${claimTicket}`; // Update the value of 'Ticket claimed By' field
    await interaction.editReply({ embeds: [embed], ephemeral: true });

    // Disable the claim button to prevent further claims
    const components = interaction.message.components; // Get existing components
    const rowIdx = components.findIndex(row => row.components.some(component => component.customId === 'claim_ticket')); // Find the row index containing the claim button
    if (rowIdx !== -1) {
        const row = components[rowIdx];
        const buttons = row.components.map(component => { // Map over components to update claim button
            if (component.customId === 'claim_ticket') {
                return new MessageButton()
                    .setCustomId('claim_ticket')
                    .setLabel('Claimed')
                    .setStyle('SUCCESS') // Change button style to secondary (greyed out)
                    .setDisabled(true); // Disable the button
            } else {
                return component;
            }
        });
        components[rowIdx] = new MessageActionRow().addComponents(...buttons); // Create a new row with updated buttons
        await interaction.editReply({ components });
    }

    return;
}

// Export the function to handle claim_ticket interaction
module.exports = {
    handleClaimTicket
};
