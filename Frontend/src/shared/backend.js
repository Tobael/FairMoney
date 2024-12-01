export const createGroup = async (group) => {
    const headers = get_headers(group.creator.name)

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

    return await fetch("http://192.168.178.30:8001/group", requestOptions);
};


export const fetchGroup = async (uuid) => {
    const headers = get_headers()

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    return await fetch(`${baseUrl}/group/${uuid}`, requestOptions);
};

export const closeGroup = async (uuid, user_name) => {
    const headers = get_headers(user_name)

    const requestOptions = {
        method: "PUT",
        headers: headers,
        redirect: "follow",
    };

    return await fetch(`${baseUrl}/group/${uuid}/close`, requestOptions);
}
export const fetchGroupHistory = async (uuid) => {
    const headers = get_headers()

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    return await fetch(`${baseUrl}/group/${uuid}/history`, requestOptions);
}
export const createPayment = async (uuid, payment, user_name) => {
    const headers = get_headers(user_name)

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

    return await fetch(`${baseUrl}/group/${uuid}/payment`, requestOptions);
}
export const fetchAccountingPreview = async (uuid) => {
    const headers = get_headers()

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    return await fetch(`${baseUrl}/group/${uuid}/accounting/preview`, requestOptions);
}
export const createAccounting = async (uuid, user_name) => {
    const headers = get_headers(user_name)

    const requestOptions = {
        method: "POST",
        headers: headers,
        redirect: "follow",
    };

    return await fetch(`${baseUrl}/group/${uuid}/accounting`, requestOptions);
}


const get_headers = (user_name) => {
    const headers = new Headers();
    if (user_name) {
        headers.append("x-user-name", user_name);
    }
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    return headers;
}

const baseUrl = "http://192.168.178.30:8001"