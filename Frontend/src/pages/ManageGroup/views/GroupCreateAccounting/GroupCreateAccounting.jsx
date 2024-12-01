import "./GroupCreateAccounting.scss";
import Header from "../../../../components/Header/header.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect} from "react";
import {fetchAccountingPreview} from "../../../../shared/backend.js";
import {getAmountAsString} from "../../../../shared/formatter.js";


export default function GroupCreateAccounting({onBackClick, onCreateAccounting, login, groupId}) {
    const [accountingPreview, setAccountingPreview] = React.useState(null)
    const [showPreview, setShowPreview] = React.useState(false)

    const getAccountingPreview = async () => {
        const result = await fetchAccountingPreview(groupId)
        if (result.ok) {
            const data = await result.json()
            console.log(data)
            setAccountingPreview(data);
        } else {
            console.error("Error: ", result)
        }
    }

    useEffect(() => {
        getAccountingPreview().then(() => setShowPreview(true))
    }, []);


    return (
        <div id="group_create_accounting_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">Hallo {login}, möchtest du die Gruppe abrechnen?</div>
            <div className="headline_text headline_no_space">Dies kann nicht rückgängig gemacht werden!</div>
            <Button
                id="btn_create_accounting"
                variant="default"
                onClick={() => onCreateAccounting()}
            >
                Ja ich bin mir sicher!
            </Button>
            <Button
                id="btn_cancel_accounting"
                variant="default"
                onClick={() => onBackClick()}
            >
                Nein lieber noch nicht
            </Button>

            {showPreview && (
                <div id="accounting_preview_container">
                    <div className="headline_text headline_no_space">Du möchtest nur eine Vorschau?</div>
                    {accountingPreview.map((transaction) => (
                        <div key={transaction.id}>
                            {transaction.payment_from} => {transaction.payment_to} {getAmountAsString(transaction.amount)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


