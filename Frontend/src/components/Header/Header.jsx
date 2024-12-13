import "./Header.scss";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Component for the header
 *
 * @returns {JSX.Element} - The Header component.
 */
export default function Header({onBackClick}) {
    return (
        <div id="header-container">
            <ArrowBackIcon id="header-back-click" onClick={() => onBackClick()}/>
            <div id="header-text">FairMoney</div>
        </div>
    );
}
