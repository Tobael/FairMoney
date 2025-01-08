import {isValidPaypalMeUrl} from './validator.js';


// T155
describe('isValidPaypalMeUrl', () => {
    it('returns true for valid PayPal.Me URL with https', () => {
        expect(isValidPaypalMeUrl('https://paypal.me/username')).toBe(true);
    });

    it('returns true for valid PayPal.Me URL without https', () => {
        expect(isValidPaypalMeUrl('paypal.me/username')).toBe(true);
    });

    it('returns false for URL with invalid domain', () => {
        expect(isValidPaypalMeUrl('https://example.com/username')).toBe(false);
    });

    it('returns false for URL with additional path segments', () => {
        expect(isValidPaypalMeUrl('https://paypal.me/username/extra')).toBe(false);
    });

    it('returns false for URL with missing username', () => {
        expect(isValidPaypalMeUrl('https://paypal.me/')).toBe(false);
    });

    it('returns false for completely invalid URL', () => {
        expect(isValidPaypalMeUrl('invalidurl')).toBe(false);
    });
});