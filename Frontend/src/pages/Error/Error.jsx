import Button from "@mui/material/Button";
import "./Error.scss";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/Footer/Footer.jsx";
import ErrorIcon from '@mui/icons-material/Error';

const ErrorPage = () => {
    const navigate = useNavigate();


    const redirectToLandingPage = () => {
        navigate(`/`);
    };


    return (
        <div id="error_page_container" className="landing_page_container">
            <div id="error_icon">
                <ErrorIcon fontSize="large"/>
            </div>

            <div className="headline_text headline_less_space">
                Leider ist ein Fehler aufgetreten.
            </div>
            <div className="headline_text headline_no_space">
                Bitte prüfe deine Internetverbindung und versuche es später erneut.
            </div>

            <Button
                id="btn_error__goto_landingpage"
                variant="landing"
                onClick={redirectToLandingPage}
            >
                Zur Startseite
            </Button>

            <Footer/>
        </div>
    );
};

export default ErrorPage;
