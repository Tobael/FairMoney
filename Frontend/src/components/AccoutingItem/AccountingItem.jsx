import "./AccountingItem.scss";
import {getAmountAsString} from "../../shared/formatter.js";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AccountingItem = ({transaction}) => {

    return (
        <div className="accounting_item_container">
            <div className="accounting_item_payment_from">{transaction.payment_from}</div>
            <div className="accounting_item_arrow"><ArrowForwardIcon/></div>
            <div className="accounting_item_payment_to">{transaction.payment_to}</div>
            <div className="accounting_item_amount">{getAmountAsString(transaction.amount)}</div>
        </div>
    );
};

export default AccountingItem;


