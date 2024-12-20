import "./GroupCreateAccounting.scss";
import Header from "../../../../components/Header/Header.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect} from "react";
import {fetchAccountingPreview} from "../../../../shared/backend.js";
import AccountingItem from "../../../../components/AccoutingItem/AccountingItem.jsx";
import {showErrorPage} from "../../../../shared/error.js";

/**
 * View for preview accounting transactions and creating an accounting for a group.
 *
 * @returns {JSX.Element} - The GroupCreateAccounting component.
 */
export default function GroupCreateAccounting({onBackClick, onCreateAccounting, login, groupId}) {
    const [accountingPreview, setAccountingPreview] = React.useState(null)
    const [showPreview, setShowPreview] = React.useState(false)

    /**
     * Fetches the accounting preview and mounts the transactions after completion.
     */
    useEffect(() => {
        const getAccountingPreview = async () => {
            const result = await fetchAccountingPreview(groupId)
            if (result.ok) {
                const data = await result.json()
                setAccountingPreview(data);
            } else {
                showErrorPage(result.toString())
            }
        }

        getAccountingPreview().then(() => setShowPreview(true))
    }, [groupId]);


    return (
        <div id="group-create-accounting-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline-text headline-less-space">Hallo {login}, möchtest du die Gruppe abrechnen?</div>
            <div className="headline-text headline-no-space">Dies kann nicht rückgängig gemacht werden!</div>
            <Button
                id="btn-create-accounting"
                variant="default"
                onClick={() => onCreateAccounting()}>
                Ja ich bin mir sicher!
            </Button>
            <Button
                id="btn-cancel-accounting"
                variant="default"
                onClick={() => onBackClick()}>
                Nein lieber noch nicht
            </Button>

            {showPreview && (
                <>
                    <div className="headline-text headline-less-space" id="create-account-preview-headline">
                        Du möchtest nur eine Vorschau?
                    </div>
                    <div id="accounting-preview-entries-container">
                        {accountingPreview.map((transaction) => (
                            <AccountingItem key={transaction.id} transaction={transaction}/>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


