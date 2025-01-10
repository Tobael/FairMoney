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

/**
 * View for accounting overview of a group after accounting was created.
 *
 * @returns {JSX.Element} - The GroupAccountingOverview component.
 */
export default function GroupAccountingOverview({onBackClick, login, group}) {
    const [accountings, setAccountings] = React.useState(null)
    const [showAccounting, setShowAccounting] = React.useState(false)

    /**
     * Writes the group accounting message to the clipboard.
     */
    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupAccountingMessage(accountings, group))
    }

    /**
     * Calls the backend to close the group.
     */
    const closeGroup = async () => {
        const result = await closeGroupBackend(group.uuid, login)
        if (!result.ok) {
            showErrorPage(result.statusText)
        }
    }

    /**
     * Fetches the accounting transactions and mounts the transactions after completion.
     */
    useEffect(() => {
        const createAccounting = async () => {
            const result = await createAccountingBackend(group.uuid, login)
            if (result.ok) {
                const data = await result.json()
                setAccountings(data);
            } else {
                showErrorPage(result.statusText)
            }
        }

        createAccounting().then(() => setShowAccounting(true))
    }, [group.uuid, login]);


    return (
        <div id="group-acconting-overview-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline-text headline-less-space">Die Gruppe wurde abgerechnet.</div>
            {showAccounting && (
                <>
                    <div className="headline-text headline-no-space">Die folgenden Transaktionen sind notwendig, um die
                        Ausgaben fair aufzuteilen:
                    </div>
                    <div id="accounting-entries-container">
                        {accountings.map((transaction) => (
                            <AccountingItem key={transaction.id} transaction={transaction}/>
                        ))}
                    </div>
                    <Button
                        id="btn-copy-accounting-msg"
                        variant="default"
                        onClick={() => writeMessageToClipboard()}
                    >
                        Abrechnungsnachricht kopieren
                    </Button>
                    <div className="headline-text headline-no-space">Soll die Gruppe weiterhin bestehen?</div>
                    <Button
                        id="btn-keep-grp"
                        variant="default"
                        onClick={() => onBackClick()}
                    >
                        Ja wir wollen weiter fair bleiben!
                    </Button>
                    <Button
                        id="btn-close-grp"
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


