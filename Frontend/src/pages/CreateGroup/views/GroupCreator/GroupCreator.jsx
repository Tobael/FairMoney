import Button from "@mui/material/Button";
import Header from "../../../../components/Header/Header.jsx";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import "./GroupCreator.scss";
import {isValidPaypalMeUrl} from "../../../../shared/validator.js";

const GroupCreator = ({onCreatorSet, onBackClick}) => {
    const [groupCreator, setGroupCreator] = useState({name: "", paypal: ""});
    const [isValidName, setIsValidName] = useState(false);
    const [isValidPaypal, setIsValidPaypal] = useState(false);

    const handleNameInputChange = (event) => {
        setGroupCreator({
            name: event.target.value,
            paypal: groupCreator.paypal,
        });
    };

    const handlePayPalInputChange = (event) => {
        setGroupCreator({
            name: groupCreator.name,
            paypal: event.target.value,
        });
    };

    useEffect(() => {
        setIsValidName(groupCreator.name.length >= 1 && groupCreator.name.length <= 30);
        setIsValidPaypal(groupCreator.paypal === "" || isValidPaypalMeUrl(groupCreator.paypal));
    }, [groupCreator]);

    return (
        <div id="group_creator_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text">
                Wer bist du?
            </div>
            <div id="box_group_creator">
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
export default GroupCreator;
