import {getAmountAsString} from "./formatter.js";

/**
 * Generates a message for inviting someone to join a group.
 *
 * @param {string} groupTitle - The title of the group.
 * @param {string} groupId - The unique identifier of the group.
 * @returns {string} - The generated invitation message.
 */
export const getGroupJoinMessage = (groupTitle, groupId) => {
    return `Hallo ich habe die Gruppe „${groupTitle}“ bei FairMoney erstellt und möchte mit dir fair Geld teilen. Mach mit und trete mit dem Link ${getUrl(groupId)} bei. Bleib fair!`
}

/**
 * Generates a message summarizing the accounting transactions for a group.
 *
 * @param {Array} transactions - The list of transactions to include in the message.
 * @param {Object} group - The group object containing group details.
 * @param {string} group.title - The title of the group.
 * @param {string} group.uuid - The unique identifier of the group.
 * @param {Array} group.users - The list of users in the group.
 * @returns {string} - The generated accounting message.
 */
export const getGroupAccountingMessage = (transactions, group) => {
    const msg_prefix = `Hallo ich habe die Gruppe „${group.title}“ bei FairMoney abgerechnet. Es ist an der Zeit die Ausgaben fair aufzuteilen. Dafür benötigen wir die folgenden Transaktionen:\n`
    const msg_suffix = `Falls du noch etwas nachschauen willst, findest du die Gruppe unter ${getUrl(group.uuid)}.\nDanke dir fürs fair sein!`

    console.log(transactions);
    console.log(group);
    const msg_transactions = transactions.reduce((acc, curr) => {
        return acc + `${curr.payment_from} schickt ${curr.payment_to} ${getAmountAsString(curr.amount)}${getPaypalMessage(curr.payment_to, group)}.\n`;
    }, "");

    return msg_prefix + msg_transactions + "\n" + msg_suffix
}

/**
 * Generates a PayPal.Me message for a user if available.
 *
 * @param {string} user - The username of the recipient.
 * @param {Object} group - The group object containing user details.
 * @param {Array} group.users - The list of users in the group.
 * @param {string} group.users[].user_name - The username of a user in the group.
 * @param {string} group.users[].paypal_me - The PayPal.Me link of a user in the group.
 * @returns {string} - The PayPal.Me message or an empty string if not available.
 */
const getPaypalMessage = (user, group) => {
    const paypal_me = group.users.filter(u => u.user_name === user)[0].paypal_me;
    return paypal_me && paypal_me !== "" ? ` Dafür kannst du gerne den folgenden Link nutzen: ${paypal_me}` : "";
}

/**
 * Generates a URL for a group based on the current window location.
 *
 * @param {string} groupId - The unique identifier of the group.
 * @returns {string} - The generated URL.
 */
export const getUrl = (groupId) => {
    return `${window.location.href}${groupId}`;
}