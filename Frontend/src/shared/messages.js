import {getAmountAsString} from "./formatter.js";

export const getGroupJoinMessage = (groupTitle, groupId) => {
    return `Hallo ich habe die Gruppe „${groupTitle}“ bei FairMoney erstellt und möchte mit dir fair Geld teilen. Mach mit und trete mit dem Link ${getUrl(groupId)} bei. Bleib fair!`
}

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


const getPaypalMessage = (user, group) => {
    const paypal_me = group.users.filter(u => u.user_name === user)[0].paypal_me;
    return paypal_me && paypal_me !== "" ? ` Dafür kannst du gerne den folgenden Link nutzen: ${paypal_me}` : "";
}


export const getUrl = (groupId) => {
    return `${window.location.href}${groupId}`;
}