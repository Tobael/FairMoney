/**
 * Checks if a given URL is a valid PayPal.Me URL.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} - Returns true if the URL is a valid PayPal.Me URL, otherwise false.
 */
export const isValidPaypalMeUrl = (url) => {
    return /^(https:\/\/)?paypal\.me\/[^/]+$/gm.test(url);
}