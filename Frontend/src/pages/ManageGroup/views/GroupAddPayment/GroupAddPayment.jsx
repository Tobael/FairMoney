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

    const addPayment = async (payment) => {
        const result = await createPayment(group.uuid, payment, login)
        if (!result.ok) {
            showErrorPage(result)
        }
    }

    const handleDescriptionInputChange = (description) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            description: description.target.value,
        }));
        setIsValidDescription(description.target.value.length >= 3 && description.target.value.length <= 30)
    };

    const handleAmountInputChange = (amount) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            amount: amount.target.value,
        }));
        setIsValidAmount(!Number.isNaN(amount.target.value) && amount.target.value > 0)
        setAmountChanged(true)
    };

    const handlePaidByInputChange = (paid_by) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            paid_by: paid_by.target.value,
        }));
    };

    const handleParticipantsSelectionChange = (participants) => {
        const selectedParticipants = participants.target.value;
        setPayment((prevPayment) => ({
            ...prevPayment,
            participants: selectedParticipants,
        }));

        setIsValidParticipantsList(selectedParticipants.length > 0);
    };

    const createMultiSelectText = (selectedParticipants) => {
        if (selectedParticipants.length === group.users.length) {
            return "Alle";
        } else if (selectedParticipants.length === 1) {
            return selectedParticipants[0];
        }
        return selectedParticipants[0] + " +" + (selectedParticipants.length - 1);
    }

    return (
        <div id="group_add_payment_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">
                Hallo {login}, welche Ausgabe möchtest du hinzufügen?
            </div>
            <div id="payment_inputs_container">
                <TextField
                    id="tf_payment_description"
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
                    id="tf_payment_amount"
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

                <div id="multi_select_container">
                    <InputLabel variant="standard" htmlFor="multi_select_participants">Wer war beteiligt?</InputLabel>
                    <Select
                        id="multi_select_participants"
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
                    id="btn_add_payment"
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
