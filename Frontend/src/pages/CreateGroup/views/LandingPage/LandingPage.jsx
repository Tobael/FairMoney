import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./LandingPage.scss";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Footer from "../../../../components/Footer/Footer.jsx";

const LandingPage = ({onNewGroup}) => {
    const [groupCode, setGroupCode] = useState("");
    const [isValidGroupCode, setIsValidGroupCode] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setGroupCode(event.target.value);
    };

    const redirectToGroup = () => {
        navigate(`/${groupCode}`);
    };


    useEffect(() => {
        const uuid4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        setIsValidGroupCode(!uuid4Regex.test(groupCode))
    }, [groupCode]);


    return (
        <div id="landing_page_container" className="landing_page_container">
            <div className="headline_text">
                Hallo, möchtest du Geld fair teilen?
            </div>

            <TextField
                id="tf_question"
                fullWidth
                label="Hast du einen Gruppencode?"
                value={groupCode}
                onChange={handleInputChange}
                variant="standard"
                InputLabelProps={{shrink: true}}
            />
            <Button
                id="btn_lp_join_group"
                variant="landing"
                disabled={isValidGroupCode}
                onClick={redirectToGroup}
            >
                Gruppe beitreten
            </Button>
            <Button
                id="btn_lp_create_group"
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

export default LandingPage;
