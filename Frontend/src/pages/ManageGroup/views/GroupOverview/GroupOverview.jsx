import "./GroupOverview.scss";
import Button from "@mui/material/Button";
import Header from "../../../../components/Header/Header.jsx";
import UserOverview from "../../../../components/UserOverview/UserOverview.jsx";
import AddIcon from "@mui/icons-material/Add";
import {Fab} from "@mui/material";

/**
 * View showing an overview of a group.
 *
 * @returns {JSX.Element} - The GroupOverview component.
 */
export default function GroupOverview({onAddPayment, onAddAccounting, onShowHistory, onBackClick, group, login}) {

    /**
     * Calculates the overall payments of the group.
     */
    const getOverallPayments = () => {
        return group.users.reduce((acc, user) => acc + user.payments.length, 0);
    }

    return (
        <div id="group-overview-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>

            <div className="headline-text headline-less-space">
                Hallo {login}, hier ist die Gruppenübersicht.
            </div>
            <div id="group-overview-user-container">
                {(group.users.map(((user, idx) => <UserOverview key={idx} user={user}/>)))}
            </div>
            <div id="overview-button-container">
                <div id="overview-button-container-left">
                    <Button
                        id="btn-goto-history"
                        variant="default"
                        onClick={() => onShowHistory()}
                    >
                        Historie anzeigen
                    </Button>
                    <Button
                        disabled={group.closed || getOverallPayments() === 0}
                        id="btn-goto-accounting"
                        variant="default"
                        onClick={() => onAddAccounting()}
                    >
                        Abrechnung erstellen
                    </Button>
                </div>
                <div id="overview-button-container-right">
                    <Fab
                        disabled={group.closed}
                        id="btn-goto-payment"
                        variant="default"
                        onClick={() => onAddPayment()}
                    >
                        <AddIcon/>
                    </Fab>
                </div>
            </div>
        </div>
    );
}
