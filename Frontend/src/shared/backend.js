import {showErrorPage} from "./error.js";

/**
 * Creates a new group with the given details.
 *
 * @param {Object} group - The group details.
 * @param {string} group.title - The title of the group.
 * @param {Object} group.creator - The creator of the group.
 * @param {string} group.creator.name - The name of the creator.
 * @param {string} group.creator.paypal - The PayPal.Me link of the creator.
 * @param {Array} group.members - The members of the group.
 * @param {string} group.members[].name - The name of a member.
 * @param {string} group.members[].paypal - The PayPal.Me link of a member.
 * @returns {Promise<Response>} - The response from the API.
 */
export const createGroup = async (group) => {
    const headers = get_headers(group.creator.name);

    const json_body = JSON.stringify({
        title: group.title,
        users: [group.creator, ...group.members].map((member) => {
            return {
                name: member.name,
                paypal_me: member.paypal,
            };
        }),
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: json_body,
        redirect: "follow",
    };

    return await fetchApi("group", requestOptions);
};

/**
 * Fetches the details of a group by its UUID.
 *
 * @param {string} uuid - The unique identifier of the group.
 * @returns {Promise<Response>} - The response from the API.
 */
export const fetchGroup = async (uuid) => {
    const headers = get_headers();

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    return await fetchApi(`group/${uuid}`, requestOptions);
};

/**
 * Closes a group by its UUID.
 *
 * @param {string} uuid - The unique identifier of the group.
 * @param {string} user_name - The name of the user closing the group.
 * @returns {Promise<Response>} - The response from the API.
 */
export const closeGroup = async (uuid, user_name) => {
    const headers = get_headers(user_name);

    const requestOptions = {
        method: "PUT",
        headers: headers,
        redirect: "follow",
    };

    return await fetchApi(`group/${uuid}/close`, requestOptions);
};

/**
 * Fetches the history of a group by its UUID.
 *
 * @param {string} uuid - The unique identifier of the group.
 * @returns {Promise<Response>} - The response from the API.
 */
export const fetchGroupHistory = async (uuid) => {
    const headers = get_headers();

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    return await fetchApi(`group/${uuid}/history`, requestOptions);
};

/**
 * Creates a new payment for a group.
 *
 * @param {string} uuid - The unique identifier of the group.
 * @param {Object} payment - The payment details.
 * @param {string} payment.description - The description of the payment.
 * @param {string} payment.paid_by - The user who made the payment.
 * @param {Array} payment.participants - The participants of the payment.
 * @param {number} payment.amount - The amount of the payment.
 * @param {string} user_name - The name of the user creating the payment.
 * @returns {Promise<Response>} - The response from the API.
 */
export const createPayment = async (uuid, payment, user_name) => {
    const headers = get_headers(user_name);

    const json_body = JSON.stringify({
        description: payment.description,
        paid_by: payment.paid_by,
        participants: payment.participants,
        amount: payment.amount
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: json_body,
        redirect: "follow",
    };

    return await fetchApi(`group/${uuid}/payment`, requestOptions);
};

/**
 * Fetches the accounting preview for a group by its UUID.
 *
 * @param {string} uuid - The unique identifier of the group.
 * @returns {Promise<Response>} - The response from the API.
 */
export const fetchAccountingPreview = async (uuid) => {
    const headers = get_headers();

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    return await fetchApi(`group/${uuid}/accounting/preview`, requestOptions);
};

/**
 * Creates the accounting for a group by its UUID.
 *
 * @param {string} uuid - The unique identifier of the group.
 * @param {string} user_name - The name of the user creating the accounting.
 * @returns {Promise<Response>} - The response from the API.
 */
export const createAccounting = async (uuid, user_name) => {
    const headers = get_headers(user_name);

    const requestOptions = {
        method: "POST",
        headers: headers,
        redirect: "follow",
    };

    return await fetchApi(`group/${uuid}/accounting`, requestOptions);
};

/**
 * Fetches data from the API with the given URL and request options.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {Object} requestOptions - The options for the fetch request.
 * @returns {Promise<Response>} - The response from the API.
 * @throws {Error} - Throws an error if the fetch request fails.
 */
const fetchApi = async (url, requestOptions) => {
    try {
        return await fetch(`${getBackendUrl()}/${url}`, requestOptions);
    } catch (error) {
        showErrorPage(error.toString());
        throw error;
    }
};

/**
 * Generates headers for the API request.
 *
 * @param {string} [user_name] - The name of the user (optional).
 * @returns {Headers} - The generated headers.
 */
export const get_headers = (user_name) => {
    const headers = new Headers();
    if (user_name) {
        headers.append("x-user-name", user_name);
    }
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    return headers;
};

/**
 * Returns the backend URL based on the current frontend hostname.
 *
 * @returns {string} - The backend URL.
 */
const getBackendUrl = () => {
    return window.location.hostname === "localhost" ?
        "http://localhost:8003" :
        "http://192.168.178.30:8003"
}