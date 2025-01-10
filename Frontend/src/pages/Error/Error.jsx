import Button from "@mui/material/Button";
import "./Error.scss";
import {useNavigate, useSearchParams} from "react-router-dom";
import Footer from "../../components/Footer/Footer.jsx";
import ErrorIcon from '@mui/icons-material/Error';
import {Box} from "@mui/material";


/**
 * Main Component to for errors
 *
 * @returns {JSX.Element} - The ErrorPage component.
 */
export default function ErrorPage() {
    const navigate = useNavigate();

    /**
     * Redirects to the landing page.
     */
    const redirectToLandingPage = () => {
        navigate(`/`);
    };

    // Read the error message from the query parameters
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get("errormsg")

    return (
        <div id="error-page-container" className="landing-page-container">
            <div id="error-icon">
                <ErrorIcon fontSize="large"/>
            </div>

            <div className="headline-text headline-no-space">
                Leider ist ein Fehler aufgetreten.
            </div>
            <Box
                id="error-message-box"
                component="span">{errorMessage}
            </Box>
            <div className="headline-text headline-no-space">
                Bitte prüfe deine Internetverbindung und versuche es später erneut.
            </div>

            <Button
                id="btn-error-goto-landingpage"
                variant="landing"
                onClick={redirectToLandingPage}
            >
                Zur Startseite
            </Button>

            <Footer/>
        </div>
    );
};

