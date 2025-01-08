import {getGroupAccountingMessage, getGroupJoinMessage} from './messages.js';

global.window = {
    location: {
        href: 'http://localhost/',
    },
};

// T153
describe('getGroupJoinMessage', () => {
    it('generates correct message with valid group title and ID', () => {
        const message = getGroupJoinMessage('Test Group', '12345');
        expect(message).toBe('Hallo ich habe die Gruppe „Test Group“ bei FairMoney erstellt und möchte mit dir fair Geld teilen. Mach mit und trete mit dem Link http://localhost/12345 bei. Bleib fair!');
    });

    it('generates correct message with empty group title and ID', () => {
        const message = getGroupJoinMessage('', '');
        expect(message).toBe('Hallo ich habe die Gruppe „“ bei FairMoney erstellt und möchte mit dir fair Geld teilen. Mach mit und trete mit dem Link http://localhost/ bei. Bleib fair!');
    });
});

// T154
describe('getGroupAccountingMessage', () => {
    it('generates correct accounting message with valid transactions and group', () => {
        const transactions = [
            {payment_from: 'Alice', payment_to: 'Bob', amount: 50},
            {payment_from: 'Charlie', payment_to: 'Dave', amount: 75}
        ];
        const group = {
            title: 'Test Group',
            uuid: '12345',
            users: [
                {user_name: 'Bob', paypal_me: 'https://paypal.me/bob'},
                {user_name: 'Dave', paypal_me: 'https://paypal.me/dave'}
            ]
        };
        const message = getGroupAccountingMessage(transactions, group);
        expect(message).toContain('Alice schickt Bob 50,00 € Dafür kannst du gerne den folgenden Link nutzen: https://paypal.me/bob/50.');
        expect(message).toContain('Charlie schickt Dave 75,00 € Dafür kannst du gerne den folgenden Link nutzen: https://paypal.me/dave/75.');
    });

    it('generates correct accounting message with empty transactions and group', () => {
        const transactions = [];
        const group = {title: '', uuid: '', users: []};
        const message = getGroupAccountingMessage(transactions, group);
        expect(message).toBe('Hallo ich habe die Gruppe „“ bei FairMoney abgerechnet. Es ist an der Zeit die Ausgaben fair aufzuteilen. Dafür benötigen wir die folgenden Transaktionen:\n\nFalls du noch etwas nachschauen willst, findest du die Gruppe unter http://localhost/.\nDanke dir fürs fair sein!');
    });

    it('generates correct accounting message with missing PayPal.Me links', () => {
        const transactions = [
            {payment_from: 'Alice', payment_to: 'Bob', amount: 50}
        ];
        const group = {
            title: 'Test Group',
            uuid: '12345',
            users: [
                {user_name: 'Bob', paypal_me: ''}
            ]
        };
        const message = getGroupAccountingMessage(transactions, group);
        expect(message).toContain('Alice schickt Bob 50,00 €.');
        expect(message).not.toContain('Dafür kannst du gerne den folgenden Link nutzen:');
    });
});