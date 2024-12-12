import "./GroupCreateAccounting.scss";
import Header from "../../../../components/Header/Header.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect} from "react";
import {fetchAccountingPreview} from "../../../../shared/backend.js";
import AccountingItem from "../../../../components/AccoutingItem/AccountingItem.jsx";
import {showErrorPage} from "../../../../shared/error.js";

export default function GroupCreateAccounting({onBackClick, onCreateAccounting, login, groupId}) {
    const [accountingPreview, setAccountingPreview] = React.useState(null)
    const [showPreview, setShowPreview] = React.useState(false)


    useEffect(() => {
        const getAccountingPreview = async () => {
            const result = await fetchAccountingPreview(groupId)
            if (result.ok) {
                const data = await result.json()
                setAccountingPreview(data);
            } else {
                showErrorPage(result)
            }
        }

        getAccountingPreview().then(() => setShowPreview(true))
    }, [groupId]);


    return (
        <div id="group_create_accounting_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">Hallo {login}, möchtest du die Gruppe abrechnen?</div>
            <div className="headline_text headline_no_space">Dies kann nicht rückgängig gemacht werden!</div>
            <Button
                id="btn_create_accounting"
                variant="default"
                onClick={() => onCreateAccounting()}>
                Ja ich bin mir sicher!
            </Button>
            <Button
                id="btn_cancel_accounting"
                variant="default"
                onClick={() => onBackClick()}>
                Nein lieber noch nicht
            </Button>

            {showPreview && (
                <>
                    <div className="headline_text headline_less_space" id="create_account_preview_headline">
                        Du möchtest nur eine Vorschau?
                    </div>
                    <div id="accounting_preview_entries_container">
                        {accountingPreview.map((transaction) => (
                            <AccountingItem key={transaction.id} transaction={transaction}/>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


