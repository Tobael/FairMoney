import "./GroupAddPayment.scss";
import Header from "../../../../components/Header/Header.jsx";
import Button from "@mui/material/Button";
import {useState} from "react";
import TextField from "@mui/material/TextField";
import {InputAdornment, InputLabel} from "@mui/material";
import {createPayment} from "../../../../shared/backend.js";
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {showErrorPage} from "../../../../shared/error.js";

/**
 * View for adding a payment to a group.
 *
 * @returns {JSX.Element} - The GroupAddPayment component.
 */
export default function GroupAddPayment({onBackClick, onPaymentAdded, group, login}) {
    const [payment, setPayment] = useState({
        description: "",
        paid_by: login,
        participants: group.users.map((user) => user.user_name),
        amount: 0
    });
    const [isValidDescription, setIsValidDescription] = useState(false);
    const [isValidAmount, setIsValidAmount] = useState(false);
    const [isValidParticipantsList, setIsValidParticipantsList] = useState(true);

    const [amountChanged, setAmountChanged] = useState(false);

    /**
     * Calls the backend to add a payment to the group.
     */
    const addPayment = async (payment) => {
        const result = await createPayment(group.uuid, payment, login)
        if (!result.ok) {
            showErrorPage(result.toString())
        }
    }

    /**
     * Handler for the description input field.
     */
    const handleDescriptionInputChange = (description) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            description: description.target.value,
        }));
        setIsValidDescription(description.target.value.length >= 3 && description.target.value.length <= 30)
    };

    /**
     * Handler for the amount input field.
     */
    const handleAmountInputChange = (amount) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            amount: amount.target.value,
        }));
        setIsValidAmount(!Number.isNaN(amount.target.value) && amount.target.value > 0)
        setAmountChanged(true)
    };

    /**
     * Handler for the paid by selection field.
     */
    const handlePaidByInputChange = (paid_by) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            paid_by: paid_by.target.value,
        }));
    };

    /**
     * Handler for the participants selection field.
     */
    const handleParticipantsSelectionChange = (participants) => {
        const selectedParticipants = participants.target.value;
        setPayment((prevPayment) => ({
            ...prevPayment,
            participants: selectedParticipants,
        }));

        setIsValidParticipantsList(selectedParticipants.length > 0);
    };

    /**
     * Creates the display text for the multi select field.
     */
    const createMultiSelectText = (selectedParticipants) => {
        if (selectedParticipants.length === group.users.length) {
            return "Alle";
        } else if (selectedParticipants.length === 1) {
            return selectedParticipants[0];
        }
        return selectedParticipants[0] + " +" + (selectedParticipants.length - 1);
    }

    return (
        <div id="group-add-payment-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline-text headline-less-space">
                Hallo {login}, welche Ausgabe möchtest du hinzufügen?
            </div>
            <div id="payment-inputs-container">
                <TextField
                    id="tf-payment-description"
                    fullWidth
                    value={payment.description}
                    label="Was wurde gezahlt?"
                    onChange={handleDescriptionInputChange}
                    variant="standard"
                    error={!isValidDescription && payment.description !== ""}
                    helperText={(!isValidDescription && payment.description !== "") ? "Bitte zwischen 3 und 30 Zeichen eingeben!" : ""}
                    InputLabelProps={{shrink: true}}
                />

                <TextField
                    id="tf-payment-amount"
                    type="number"
                    min="0"
                    step="any"
                    fullWidth
                    value={payment.amount}
                    label="Wieviel hat es gekostet?"
                    onChange={handleAmountInputChange}
                    variant="standard"
                    error={!isValidAmount && amountChanged}
                    helperText={(!isValidAmount && amountChanged) ? "Bitte gebe einen gültigen positiven Betrag ein!" : ""}
                    InputLabelProps={{shrink: true}}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        },
                    }}
                />

                <TextField
                    id="standard-select-currency"
                    select
                    label="Wer hat gezahlt?"
                    defaultValue={login}
                    variant="standard"
                    onChange={handlePaidByInputChange}>
                    {group.users.map((user) => (
                        <MenuItem key={user.user_name} value={user.user_name}>
                            {user.user_name}
                        </MenuItem>
                    ))}
                </TextField>

                <div id="multi-select-container">
                    <InputLabel variant="standard" htmlFor="multi-select-participants">Wer war beteiligt?</InputLabel>
                    <Select
                        id="multi-select-participants"
                        fullWidth={true}
                        multiple
                        label="Wer war beteiligt?"
                        value={payment.participants.map((user_name) => user_name)}
                        onChange={handleParticipantsSelectionChange}
                        renderValue={(selected) => createMultiSelectText(selected)}
                        variant="standard">
                        {group.users.map((user) => (
                            <MenuItem key={user.user_name} value={user.user_name}>
                                <Checkbox checked={payment.participants.includes(user.user_name)}/>
                                <ListItemText primary={user.user_name}/>
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                <Button
                    id="btn-add-payment"
                    variant="default"
                    disabled={!isValidDescription || !isValidAmount || !isValidParticipantsList || !amountChanged}
                    onClick={async () => {
                        await addPayment(payment)
                        onPaymentAdded(payment)
                    }}
                >
                    Ausgabe hinzufügen
                </Button>
            </div>
        </div>
    );
}
