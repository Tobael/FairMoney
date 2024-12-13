import "./AccountingItem.scss";
import {getAmountAsString} from "../../shared/formatter.js";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Component to display a single accounting transaction.
 *
 * @returns {JSX.Element} - The AccountingItem component.
 */
export default function AccountingItem({transaction}) {
    return (
        <div className="accounting-item-container">
            <div className="accounting-item-payment-from">{transaction.payment_from}</div>
            <div className="accounting-item-arrow"><ArrowForwardIcon/></div>
            <div className="accounting-item-payment-to">{transaction.payment_to}</div>
            <div className="accounting-item-amount">{getAmountAsString(transaction.amount)}</div>
        </div>
    );
};

