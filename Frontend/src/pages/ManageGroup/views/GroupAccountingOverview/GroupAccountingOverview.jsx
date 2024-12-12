import "./GroupAccountingOverview.scss";
import Header from "../../../../components/Header/Header.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect} from "react";
import {
    closeGroup as closeGroupBackend,
    createAccounting as createAccountingBackend,
} from "../../../../shared/backend.js";
import {getGroupAccountingMessage} from "../../../../shared/messages.js";
import AccountingItem from "../../../../components/AccoutingItem/AccountingItem.jsx";
import {showErrorPage} from "../../../../shared/error.js";


export default function GroupAccountingOverview({onBackClick, login, group}) {
    const [accountings, setAccountings] = React.useState(null)
    const [showAccounting, setShowAccounting] = React.useState(false)

    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupAccountingMessage(accountings, group))
    }


    const closeGroup = async () => {
        const result = await closeGroupBackend(group.uuid, login)
        if (!result.ok) {
            showErrorPage(result)
        }
    }

    useEffect(() => {
        const createAccounting = async () => {
            const result = await createAccountingBackend(group.uuid, login)
            if (result.ok) {
                const data = await result.json()
                setAccountings(data);
            } else {
                showErrorPage(result)
            }
        }

        createAccounting().then(() => setShowAccounting(true))
    }, [group.uuid, login]);


    return (
        <div id="group_acconting_overview_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">Die Gruppe wurde abgerechnet.</div>
            {showAccounting && (
                <>
                    <div className="headline_text headline_no_space">Die folgenden Transaktionen sind notwendig, um die
                        Ausgaben fair aufzuteilen:
                    </div>
                    <div id="accounting_entries_container">
                        {accountings.map((transaction) => (
                            <AccountingItem key={transaction.id} transaction={transaction}/>
                        ))}
                    </div>
                    <Button
                        id="btn_copy_accounting_msg"
                        variant="default"
                        onClick={() => writeMessageToClipboard()}
                    >
                        Abrechnungsnachricht kopieren
                    </Button>
                    <div className="headline_text headline_no_space">Soll die Gruppe weiterhin bestehen?</div>
                    <Button
                        id="btn_keep_grp"
                        variant="default"
                        onClick={() => onBackClick()}
                    >
                        Ja wir wollen weiter fair bleiben!
                    </Button>
                    <Button
                        id="btn_close_grp"
                        variant="default"
                        onClick={async () => {
                            await closeGroup()
                            onBackClick()
                        }}
                    >
                        Nein danke.
                    </Button>
                </>
            )}
        </div>
    );
}


