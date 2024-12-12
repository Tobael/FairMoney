import "./GroupOverview.scss";
import Button from "@mui/material/Button";
import Header from "../../../../components/Header/Header.jsx";
import UserOverview from "../../../../components/UserOverview/UserOverview.jsx";
import AddIcon from "@mui/icons-material/Add";
import {Fab} from "@mui/material";

export default function GroupOverview({onAddPayment, onAddAccounting, onShowHistory, onBackClick, group, login}) {

    const getOverallPayments = () => {
        return group.users.reduce((acc, user) => acc + user.payments.length, 0);
    }


    return (
        <div id="group_overview_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>

            <div className="headline_text headline_less_space">
                Hallo {login}, hier ist die Gruppenübersicht.
            </div>
            <div id="group_overview_user_container">
                {(group.users.map(((user, idx) => <UserOverview key={idx} user={user}/>)))}
            </div>
            <div id="overview_button_container">
                <div id="overview_button_container_left">
                    <Button
                        id="btn_goto_history"
                        variant="default"
                        onClick={() => onShowHistory()}
                    >
                        Historie anzeigen
                    </Button>
                    <Button
                        disabled={group.closed || getOverallPayments() === 0}
                        id="btn_goto_accounting"
                        variant="default"
                        onClick={() => onAddAccounting()}
                    >
                        Abrechnung erstellen
                    </Button>
                </div>
                <div id="overview_button_container_right">
                    <Fab
                        disabled={group.closed}
                        id="btn_goto_payment"
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
