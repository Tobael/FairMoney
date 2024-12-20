/**
 * Redirects the user to the error page.
 */
export const showErrorPage = (error = "") => {
    window.location.href = `/error?errormsg=${error}`;
}