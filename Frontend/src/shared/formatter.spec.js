import {getAmountAsString} from './formatter.js';

// T152
describe('getAmountAsString', () => {
    it('formats positive amount correctly', () => {
        expect(getAmountAsString(1234.56)).toBe('1234,56 €');
    });

    it('formats negative amount correctly', () => {
        expect(getAmountAsString(-1234.56)).toBe('1234,56 €');
    });

    it('formats zero amount correctly', () => {
        expect(getAmountAsString(0)).toBe('0,00 €');
    });

    it('formats amount with no decimal places correctly', () => {
        expect(getAmountAsString(1234)).toBe('1234,00 €');
    });

    it('formats amount with one decimal place correctly', () => {
        expect(getAmountAsString(1234.5)).toBe('1234,50 €');
    });
});