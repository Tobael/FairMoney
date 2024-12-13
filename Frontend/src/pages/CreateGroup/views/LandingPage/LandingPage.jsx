import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./LandingPage.scss";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Footer from "../../../../components/Footer/Footer.jsx";


/**
 * View for the landing page of the app.
 *
 * @returns {JSX.Element} - The LandingPage component.
 */export default function LandingPage({onNewGroup}) {
    const [groupCode, setGroupCode] = useState("");
    const [isValidGroupCode, setIsValidGroupCode] = useState(false);

    const navigate = useNavigate();

    /**
     * Handler for the UUID input field.
     */
    const handleInputChange = (event) => {
        setGroupCode(event.target.value);
    };

    /**
     * Redirects to the group page.
     */
    const redirectToGroup = () => {
        navigate(`/${groupCode}`);
    };

    /**
     * Checks if the input fields are valid.
     */
    useEffect(() => {
        const uuid4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        setIsValidGroupCode(!uuid4Regex.test(groupCode))
    }, [groupCode]);


    return (
        <div id="landing-page-container" className="landing-page-container">
            <div className="headline-text">
                Hallo, möchtest du Geld fair teilen?
            </div>

            <TextField
                id="tf-question"
                fullWidth
                label="Hast du einen Gruppencode?"
                value={groupCode}
                onChange={handleInputChange}
                variant="standard"
                InputLabelProps={{shrink: true}}
            />
            <Button
                id="btn-lp-join-group"
                variant="landing"
                disabled={isValidGroupCode}
                onClick={redirectToGroup}
            >
                Gruppe beitreten
            </Button>
            <Button
                id="btn-lp-create-group"
                className="MuiButton-landing"
                variant="landing"
                onClick={() => onNewGroup()}
            >
                + Neue Gruppe erstellen
            </Button>
            <Footer/>
        </div>
    );
};

