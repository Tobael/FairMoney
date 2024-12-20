/**
 * Converts a numeric amount to a string formatted as a currency value.
 *
 * @param {number} amount - The numeric amount to format.
 * @returns {string} - The formatted amount as a string with two decimal places,
 *                     a comma as the decimal separator, and a euro symbol.
 */
export const getAmountAsString = (amount) => {
    return `${Math.abs(amount).toFixed(2).replace('.', ',')} €`
}