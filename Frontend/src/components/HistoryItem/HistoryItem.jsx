import * as React from "react";
import "./HistoryItem.scss";
import HLineText from "../HLineText/HLineText.jsx";
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import {Unstable_Popup as BasePopup} from '@mui/base/Unstable_Popup';
import {styled} from '@mui/system';
import {getAmountAsString} from "../../shared/formatter.js";

export default function HistoryItem({item}) {
    const [anchor, setAnchor] = React.useState(null);

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


    const popupOpen = Boolean(anchor);

    const showPopups = (event) => {
        setAnchor(anchor ? null : event.currentTarget);
    }
    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

    const blue = {
        200: '#99CCFF',
        300: '#66B2FF',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        700: '#0066CC',
    };
    const PopupBody = styled('div')(
        ({theme}) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: ${
            theme.palette.mode === 'dark'
                ? `0px 4px 8px rgb(0 0 0 / 0.7)`
                : `0px 4px 8px rgb(0 0 0 / 0.1)`
        };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`,
    );
    const id = open ? 'simple-popup' : undefined;


    return (
        <div className="history_item">
            <HLineText text={getHeadline()} size="small"/>
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
                <div className="history_item_informations">
                    <IconButton id="info_button" onClick={showPopups}>
                        <InfoIcon/>
                    </IconButton>
                    <BasePopup id={id} open={popupOpen} anchor={anchor}>
                        <PopupBody>
                        </PopupBody>
                    </BasePopup>
                </div>
            )}
        </div>

    );
};
