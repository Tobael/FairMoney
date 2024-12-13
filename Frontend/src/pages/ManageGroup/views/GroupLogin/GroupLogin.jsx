import "./GroupLogin.scss";
import Footer from "../../../../components/Footer/Footer.jsx";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";

/**
 * View for selecting user of group.
 *
 * @returns {JSX.Element} - The GroupLogin component.
 */
export default function GroupLogin({group, onUserSelected}) {

    return (
        <div id="group-login-container" className="landing-page-container">
            <div className="headline-text">Hallo, willkommen in der Gruppe</div>
            <div className="headline-text headline-no-space">{group.title}.</div>
            <div className="headline-text headline-no-space">
                Als wen darf ich dich anmelden?
            </div>

            <Box id="user-button-list">
                {group.users.map((user) => (
                    <Button
                        key={user.user_name}
                        variant="landing"
                        className="user-button"
                        onClick={() => onUserSelected(user.user_name)}>
                        {user.user_name}
                    </Button>
                ))}
            </Box>
            <Footer/>
        </div>
    );
}
