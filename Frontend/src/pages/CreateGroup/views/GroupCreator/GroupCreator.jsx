import Button from "@mui/material/Button";
import Header from "../../../../components/Header/Header.jsx";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import "./GroupCreator.scss";
import {isValidPaypalMeUrl} from "../../../../shared/validator.js";

/**
 * View for adding the information of the group creator.
 *
 * @returns {JSX.Element} - The GroupCreator component.
 */
export default function GroupCreator({onCreatorSet, onBackClick}) {
    const [groupCreator, setGroupCreator] = useState({name: "", paypal: ""});
    const [isValidName, setIsValidName] = useState(false);
    const [isValidPaypal, setIsValidPaypal] = useState(false);

    /**
     * Handler for the name input field.
     */
    const handleNameInputChange = (event) => {
        setGroupCreator({
            name: event.target.value,
            paypal: groupCreator.paypal,
        });
    };

    /**
     * Handler for the PayPal input field.
     */
    const handlePayPalInputChange = (event) => {
        setGroupCreator({
            name: groupCreator.name,
            paypal: event.target.value,
        });
    };

    /**
     * Checks if the input fields are valid.
     */
    useEffect(() => {
        setIsValidName(groupCreator.name.length >= 1 && groupCreator.name.length <= 30);
        setIsValidPaypal(groupCreator.paypal === "" || isValidPaypalMeUrl(groupCreator.paypal));
    }, [groupCreator]);

    return (
        <div id="group-creator-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline-text">
                Wer bist du?
            </div>
            <div id="box-group-creator">
                <TextField
                    fullWidth
                    value={groupCreator.name}
                    label="Wie ist dein Name?"
                    onChange={handleNameInputChange}
                    error={!isValidName && groupCreator.name !== ""}
                    helperText={isValidName || groupCreator.name === "" ? "" : "Bitte maximal 30 Zeichen ein!"}
                    variant="standard"
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    fullWidth
                    value={groupCreator.paypal}
                    label="Hast du einen PayPal.me Link (optional)?"
                    onChange={handlePayPalInputChange}
                    error={!isValidPaypal && groupCreator.paypal !== ""}
                    helperText={isValidPaypal || groupCreator.paypal === "" ? "" : "Bitte gib einen gültigen PayPal.me Link ein"}
                    variant="standard"
                    InputLabelProps={{shrink: true}}
                />
                <Button
                    variant="default"
                    disabled={!isValidName || !isValidPaypal}
                    onClick={() => onCreatorSet(groupCreator)}
                >
                    Weiter
                </Button>
            </div>
        </div>
    );
};
