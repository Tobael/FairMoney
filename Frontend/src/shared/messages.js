export const getGroupJoinMessage = (groupTitle, groupId) => {
    return `Hallo ich habe die Gruppe „${groupTitle}“ bei FairMoney erstellt und möchte mit dir fair Geld teilen. Mach mit und trete mit dem Link ${getUrl(groupId)} bei. Bleib fair!`
}

export const getGroupAccountingMessage = (accounting, groupTitle, groupId) => {
    const msg_prefix = `Hallo ich habe die Gruppe „${groupTitle}“ bei FairMoney abgerechnet. Es ist an der Zeit die Ausgaben fair aufzuteilen. Dafür benötigen wir die folgenden Transaktionen:`
    const msg_suffix = `Falls du noch etwas nachschauen willst, findest du die Gruppe unter ${getUrl(groupId)}. Danke dir fürs fair sein!`

    return msg_prefix + msg_suffix
}


export const getUrl = (groupId) => {
    return `${window.location.href}${groupId}`;
}