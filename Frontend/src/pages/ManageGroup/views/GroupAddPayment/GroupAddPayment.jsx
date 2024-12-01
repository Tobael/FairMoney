import "./GroupAddPayment.scss";
import Header from "../../../../components/Header/header.jsx";
import Button from "@mui/material/Button";
import * as React from "react";
import {useState} from "react";
import TextField from "@mui/material/TextField";
import {InputAdornment, MenuItem} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {createPayment} from "../../../../shared/backend.js";

export default function GroupAddPayment({onBackClick, onPaymentAdded, group, login}) {
    const [payment, setPayment] = useState({
        description: "",
        paid_by: login,
        participants: group.users.map((user) => user.user_name),
        amount: 0
    });

    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;


    const addPayment = async (payment) => {
        const result = await createPayment(group.uuid, payment, login)
        if (result.ok) {
            console.log("Payment added")
        } else {
            console.error("Error: ", result)
        }
    }


    const handleDescriptionInputChange = (description) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            description: description.target.value,
        }));
    };
    const handlePaidByInputChange = (paid_by) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            paid_by: paid_by.target.value,
        }));
    };

    const handleParticipantsSelectionChange = (event, participants) => {


        const x = participants.map((participant) => participant.user_name)
        console.log(x)

        setPayment((prevPayment) => ({
            ...prevPayment,
            participants: x,
        }));

        console.log(payment)


    };
    const handleAmountInputChange = (amount) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            amount: amount.target.value,
        }));
    };


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

                <Autocomplete
                    multiple
                    id="participants_selection"
                    limitTags={1}
                    options={group.users}
                    getOptionLabel={(option) => option.user_name}
                    defaultValue={group.users}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Wer war beteiligt?"
                            placeholder=""
                        />
                    )}
                />


                <Button
                    id="btn_add_payment"
                    variant="default"
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
