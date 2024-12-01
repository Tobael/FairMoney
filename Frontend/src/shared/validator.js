export const isValidPaypalMeUrl = (url) => {
    return /^((?:https):\/\/)?paypal\.me\/.+/gm.test(url);
}