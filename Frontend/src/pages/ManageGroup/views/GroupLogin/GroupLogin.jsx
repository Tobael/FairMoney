import "./GroupLogin.scss";
import Footer from "../../../../components/Footer/footer.jsx";
import * as React from "react";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";

export default function GroupLogin({group, onUserSelected}) {

    return (
        <div id="group_login_container" className="landing_page_container">
            <div className="headline_text">Hallo, willkommen in der Gruppe</div>
            <div className="headline_text headline_no_space">{group.title}.</div>
            <div className="headline_text headline_no_space">
                Als wen darf ich dich anmelden?
            </div>

            <Box id="user_button_list">
                {group.users.map((user) => (
                    <Button
                        key={user.user_name}
                        variant="landing"
                        className="user_button"
                        onClick={() => onUserSelected(user.user_name)}>
                        {user.user_name}
                    </Button>
                ))}
            </Box>
            <Footer/>
        </div>
    );
}
