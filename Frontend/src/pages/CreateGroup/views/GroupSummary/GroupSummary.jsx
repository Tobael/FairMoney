import "./GroupSummary.scss";
import Button from "@mui/material/Button";
import Header from "../../../../components/Header/Header.jsx";
import {useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UserList from "../../../../components/UserList/UserList.jsx";
import {getGroupJoinMessage, getUrl} from "../../../../shared/messages.js";

/**
 * View for displaying the group summary after the group was created.
 *
 * @returns {JSX.Element} - The GroupSummary component.
 */
export default function GroupSummary({groupId, groupTitle, creator, groupMember, onBackClick}) {
    const navigate = useNavigate();

    /**
     * Redirects to the group page.
     */
    const redirectToGroup = () => {
        navigate(`/${groupId}`);
    };

    /**
     * Writes the group URL to the clipboard.
     */
    const writeUrlToClipboard = () => {
        navigator.clipboard.writeText(getUrl(groupId))
    }
    /**
     * Writes the group join message to the clipboard.
     */
    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupJoinMessage(groupTitle, groupId))
    }

    return (
        <div id="group-summary-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline-text headline-less-space">
                Deine neue Gruppe wurde erstellt.
            </div>

            <div id="url-text">
                {getUrl(groupId)}
                <IconButton id="copy-icon" onClick={() => writeUrlToClipboard()}>
                    <ContentCopyIcon/>
                </IconButton>
            </div>
            <Button
                id="btn-copy-join-msg"
                variant="default"
                onClick={() => writeMessageToClipboard()}
            >
                Einladungsnachricht kopieren
            </Button>
            <div id="box-group-member-summary">
                <UserList
                    creator={creator}
                    users={groupMember}/>
            </div>
            <Button
                id="btn-join-group"
                variant="default"
                onClick={() => redirectToGroup()}
            >
                Zur Gruppe gehen
            </Button>

        </div>
    );
};

