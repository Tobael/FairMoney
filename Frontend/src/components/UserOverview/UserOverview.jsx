import "./UserOverview.scss";
import HLineText from "../HLineText/HLineText.jsx";
import {getAmountAsString} from "../../shared/formatter.js";

/**
 * Component for displaying information about a user in  the overview page
 *
 * @returns {JSX.Element} - The HistoryItem component.
 */
export default function UserOverview({user}) {
    return (
        <div id="user-overview-container">
            <HLineText text={`${user.user_name} (${getAmountAsString(user.sum_amount)})`}/>
            <div id="users-overview-payments">
                {user.payments.length > 0 ? user.payments.map((payment, index) => {
                    return (
                        <div key={index} className="users-overview-payment">
                            <div className="users-overview-payment-description">
                                {payment.description}
                            </div>
                            <div className="users-overview-payment-amount">
                                {getAmountAsString(payment.amount)}
                            </div>
                        </div>
                    );
                }) : "hatte bisher keine Ausgaben"}
            </div>

        </div>
    );
};
