import "./GroupAccountingOverview.scss";
import Header from "../../../../components/Header/header.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect} from "react";
import {
    closeGroup as closeGroupBackend,
    createAccounting as createAccountingBackend,
} from "../../../../shared/backend.js";
import {getGroupAccountingMessage} from "../../../../shared/messages.js";
import {getAmountAsString} from "../../../../shared/formatter.js";


export default function GroupAccountingOverview({onBackClick, login, groupId, groupTitle}) {
    const [accounting, setAccounting] = React.useState(null)
    const [showAccounting, setShowAccounting] = React.useState(false)

    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupAccountingMessage(accounting, groupTitle, groupId))
    }

    const createAccounting = async () => {
        const result = await createAccountingBackend(groupId, login)
        if (result.ok) {
            const data = await result.json()
            setAccounting(data);
        } else {
            console.error("Error: ", result)
        }
    }

    const closeGroup = async () => {
        const result = await closeGroupBackend(groupId, login)
        if (!result.ok) {
            console.error("Error: ", result)
        }
    }

    useEffect(() => {
        createAccounting().then(() => setShowAccounting(true))
    }, []);


    return (
        <div id="group_acconting_overview_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">Die Gruppe wurde abgerechnet.</div>
            {showAccounting && (
                <div id="group_acconting_overview_inner_container">
                    <div className="headline_text headline_no_space">Die folgenden Transaktionen sind notwendig, um die
                        Ausgaben fair aufzuteilen:
                    </div>
                    {accounting.map((transaction) => (
                        <div key={transaction.id}>
                            {transaction.payment_from} => {transaction.payment_to} {getAmountAsString(transaction.amount)}
                        </div>
                    ))}
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
                </div>
            )}
        </div>
    );
}


