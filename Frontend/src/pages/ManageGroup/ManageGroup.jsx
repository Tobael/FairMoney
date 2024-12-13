import "./ManageGroup.scss";
import {useLoaderData} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import {fetchGroup} from "../../shared/backend.js";
import GroupLogin from "./views/GroupLogin/GroupLogin.jsx";
import GroupOverview from "./views/GroupOverview/GroupOverview.jsx";
import GroupAddPayment from "./views/GroupAddPayment/GroupAddPayment.jsx";
import GroupHistory from "./views/GroupHistory/GroupHistory.jsx";
import GroupCreateAccounting from "./views/GroupCreateAccounting/GroupCreateAccounting.jsx";
import GroupAccountingOverview from "./views/GroupAccountingOverview/GroupAccountingOverview.jsx";
import {ManageGroupViews} from "../../shared/enums.js";
import {showErrorPage} from "../../shared/error.js";


/**
 * Loader function to get the group ID from the route parameters.
 *
 * @param {Object} params - The route parameters.
 * @returns {string} - The group ID.
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function loader({params}) {
    return params.groupId;
}

/**
 * Page to manage a group
 *
 * @returns {JSX.Element} - The ManageGroup component.
 */
export default function ManageGroup() {
    const [show, setCurrentView] = React.useState(0);
    const [group, setGroup] = React.useState(null)
    const [login, setLogin] = React.useState(null);

    // Read the group ID from the loader
    const groupId = useLoaderData();

    /**
     * Fetches the group details and sets the group state.
     */
    const getGroup = useCallback(async () => {
        const result = await fetchGroup(groupId)
        if (result.ok) {
            const data = await result.json()
            setGroup(data);
            return data
        } else {
            showErrorPage(result)
        }
    }, [groupId]);

    /**
     * Fetches the group on load and sets the tab title to include the group name.
     */
    useEffect(() => {
        getGroup().then((group) => {
            setCurrentView(ManageGroupViews.GroupLogin)
            document.title = `FairMoney - ${group.title}`;
        })
    }, [getGroup]);

    /**
     * Resets the view to the login screen when the arrow back is clicked.
     */
    useEffect(() => {
        if (login === null && group !== null) {
            setCurrentView(ManageGroupViews.GroupLogin)
        }
    }, [login, group]);

    return (
        <div id="create-group-wrapper">
            {show === ManageGroupViews.GroupLogin && (
                <GroupLogin
                    group={group}
                    onUserSelected={(selectedUser) => {
                        setLogin(selectedUser)
                        setCurrentView(ManageGroupViews.GroupOverview)
                    }}/>
            )}
            {show === ManageGroupViews.GroupOverview && (
                <GroupOverview
                    onBackClick={() => {
                        setLogin(null)
                    }}

                    onAddPayment={() => {
                        setCurrentView(ManageGroupViews.GroupAddPayment)
                    }}
                    onShowHistory={() => {
                        setCurrentView(ManageGroupViews.GroupHistory)
                    }}
                    onAddAccounting={() => {
                        setCurrentView(ManageGroupViews.GroupCreateAccounting)
                    }}
                    group={group}
                    login={login}
                />
            )}
            {show === ManageGroupViews.GroupAddPayment && (
                <GroupAddPayment
                    onBackClick={() => {
                        setCurrentView(ManageGroupViews.GroupOverview)
                    }}
                    onPaymentAdded={async () => {
                        setCurrentView(ManageGroupViews.None)
                        await getGroup()
                        setCurrentView(ManageGroupViews.GroupOverview)
                    }}
                    group={group}
                    login={login}
                />
            )}
            {show === ManageGroupViews.GroupHistory && (
                <GroupHistory
                    onBackClick={() => {
                        setCurrentView(ManageGroupViews.GroupOverview)
                    }}
                    group={group}
                    login={login}
                />
            )}
            {show === ManageGroupViews.GroupCreateAccounting && (
                <GroupCreateAccounting
                    onBackClick={() => {
                        setCurrentView(ManageGroupViews.GroupOverview)
                    }}
                    onCreateAccounting={() => {
                        setCurrentView(ManageGroupViews.GroupAccountingOverview)
                    }}
                    login={login}
                    groupId={groupId}
                />
            )}
            {show === ManageGroupViews.GroupAccountingOverview && (
                <GroupAccountingOverview
                    onBackClick={async () => {
                        setCurrentView(ManageGroupViews.None)
                        await getGroup();
                        setCurrentView(ManageGroupViews.GroupOverview)
                    }}
                    group={group}
                    login={login}
                />
            )}
        </div>
    );
}
