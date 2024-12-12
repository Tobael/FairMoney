import "./Header.scss";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Header({onBackClick}) {
    return (
        <div id="header_container">
            <ArrowBackIcon id="header_back_click" onClick={() => onBackClick()}/>
            <div id="header_text">FairMoney</div>
        </div>
    );
}
