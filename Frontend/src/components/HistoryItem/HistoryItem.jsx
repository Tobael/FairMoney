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

/**
 * Component for a history item. Using reactjs-popup for the popup.
 *
 * @returns {JSX.Element} - The HistoryItem component.
 */
export default function HistoryItem({group, item}) {

    /**
     * Creates the display text for the headline for the history item.
     */
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

    /**
     * Writes the group accounting message to the clipboard.
     */
    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupAccountingMessage(item.details, group))
    }


    return (
        <div className="history-item">
            <div className="history-item-headline">
                <HLineText text={getHeadline()} size="small"/>
            </div>
            {item.type.toString() === "CREATED" && (
                <div className="history-item-text">
                    Gruppe wurde erstellt.
                </div>
            )}
            {item.type.toString() === "PAYMENT" && (
                <div className="history-item-text">
                    {item.creator} hat {getAmountAsString(item.details.amount)} ausgegeben.
                </div>
            )}
            {item.type.toString() === "ACCOUTING" && (
                <div className="history-item-text">
                    {item.creator} hat die Gruppe abgerechnet.
                </div>
            )}
            {item.type.toString() === "CLOSED" && (
                <div className="history-item-text">
                    {item.creator} hat die Gruppe geschlossen.
                </div>
            )}
            {(item.type.toString() === "PAYMENT" || item.type.toString() === "ACCOUTING") && (
                <Popup trigger={
                    <IconButton id="info-button">
                        <InfoIcon style={{color: 'white'}}/>
                    </IconButton>}
                       modal
                       position="left center">
                    {close => (
                        <div className="popup-modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="popup-content-container">
                                {item.type.toString() === "PAYMENT" && (
                                    <>
                                        <div id="popup-title">Ausgabe</div>
                                        <div
                                            id="popup-payment-description">Beschreibung: {item.details.description}</div>
                                        <div
                                            id="popup-payment-amount">Kosten: {getAmountAsString(item.details.amount)}</div>
                                        <div id="popup-payment-paid-by">Bezahlt von: {item.details.paid_by}</div>
                                        <div
                                            id="popup-payment-participants">Beteiligt: {item.details.participants.join(", ")}</div>
                                    </>
                                )}
                                {item.type.toString() === "ACCOUTING" && (
                                    <>
                                        <div id="popup-title">Abrechnung</div>
                                        <div id="popup-accounting-transactions-container">
                                            {item.details.map((transaction) => (
                                                <AccountingItem key={transaction.id} transaction={transaction}/>
                                            ))}
                                        </div>
                                        <div id="popup-accounting-copy-msg">
                                            <Button

                                                variant="default"
                                                className="user-button"
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
