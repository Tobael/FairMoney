export const getAmountAsString = (amount) => {
    return `${amount.toFixed(2).replace('.', ',')} €`
}