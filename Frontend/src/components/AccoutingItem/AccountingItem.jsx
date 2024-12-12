import "./AccountingItem.scss";
import {getAmountAsString} from "../../shared/formatter.js";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AccountingItem = ({transaction}) => {

    return (
        <div id="accounting_item_container">
            <div id="accounting_item_payment_from">{transaction.payment_from}</div>
            <div id="accounting_item_arrow"><ArrowForwardIcon/></div>
            <div id="accounting_item_payment_to">{transaction.payment_to}</div>
            <div id="accounting_item_amount">{getAmountAsString(transaction.amount)}</div>
        </div>
    );
};

export default AccountingItem;


