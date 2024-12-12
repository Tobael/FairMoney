import "./HistoryItem.scss";
import HLineText from "../HLineText/HLineText.jsx";
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import {getAmountAsString} from "../../shared/formatter.js";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import AccountingItem from "../AccoutingItem/AccountingItem.jsx";
import Button from "@mui/material/Button";
import {getGroupAccountingMessage} from "../../shared/messages.js";

export default function HistoryItem({group, item}) {
    const getHeadline = () => {
        const date = new Date(item.datetime);
        const formattedDate = date.toLocaleString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${formattedDate} von ${item.creator} eingetragen`
    }

    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupAccountingMessage(item.details, group))
    }


    return (
        <div className="history_item">
            <div className="history_item_headline">
                <HLineText text={getHeadline()} size="small"/>
            </div>
            {item.type.toString() === "CREATED" && (
                <div className="history_item_text">
                    Gruppe wurde erstellt.
                </div>
            )}
            {item.type.toString() === "PAYMENT" && (
                <div className="history_item_text">
                    {item.creator} hat {getAmountAsString(item.details.amount)} ausgegeben.
                </div>
            )}
            {item.type.toString() === "ACCOUTING" && (
                <div className="history_item_text">
                    {item.creator} hat die Gruppe abgerechnet.
                </div>
            )}
            {item.type.toString() === "CLOSED" && (
                <div className="history_item_text">
                    {item.creator} hat die Gruppe geschlossen.
                </div>
            )}
            {(item.type.toString() === "PAYMENT" || item.type.toString() === "ACCOUTING") && (
                <Popup trigger={
                    <IconButton id="info_button">
                        <InfoIcon style={{color: 'white'}}/>
                    </IconButton>}
                       modal
                       position="left center">
                    {close => (
                        <div className="popup_modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="popup-content-container">
                                {item.type.toString() === "PAYMENT" && (
                                    <>
                                        <div id="popup_title">Ausgabe</div>
                                        <div
                                            id="popup_payment_description">Beschreibung: {item.details.description}</div>
                                        <div
                                            id="popup_payment_amount">Kosten: {getAmountAsString(item.details.amount)}</div>
                                        <div id="popup_payment_paid_by">Bezahlt von: {item.details.paid_by}</div>
                                        <div
                                            id="popup_payment_participants">Beteiligt: {item.details.participants.join(", ")}</div>
                                    </>
                                )}
                                {item.type.toString() === "ACCOUTING" && (
                                    <>
                                        <div id="popup_title">Abrechnung</div>
                                        <div id="popup_accounting_transactions_container">
                                            {item.details.map((transaction) => (
                                                <AccountingItem key={transaction.id} transaction={transaction}/>
                                            ))}
                                        </div>
                                        <div id="popup_accounting_copy_msg">
                                            <Button

                                                variant="default"
                                                className="user_button"
                                                onClick={() => writeMessageToClipboard()}>
                                                Abrechnungsnachricht kopieren
                                            </Button>

                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </Popup>
            )}
        </div>
    );
};
