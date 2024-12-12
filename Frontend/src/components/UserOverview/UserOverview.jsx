import "./UserOverview.scss";
import HLineText from "../HLineText/HLineText.jsx";

export default function UserOverview({user}) {
    return (
        <div id="user_overview_container">
            <HLineText text={`${user.user_name} (${user.sum_amount} €)`}/>
            <div id="users_overview_payments">
                {user.payments.length > 0 ? user.payments.map((payment, index) => {
                    return (
                        <div key={index} className="users_overview_payment">
                            <div className="users_overview_payment_description">
                                {payment.description}
                            </div>
                            <div className="users_overview_payment_amount">
                                {payment.amount} €
                            </div>
                        </div>
                    );
                }) : "hatte bisher keine Ausgaben"}
            </div>

        </div>
    );
};
