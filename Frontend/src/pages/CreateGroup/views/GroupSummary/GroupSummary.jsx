import "./GroupSummary.scss";
import Button from "@mui/material/Button";
import Header from "../../../../components/Header/Header.jsx";
import {useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UserList from "../../../../components/UserList/UserList.jsx";
import {getGroupJoinMessage, getUrl} from "../../../../shared/messages.js";

const GroupSummary = ({groupId, groupTitle, creator, groupMember, onBackClick}) => {
    const navigate = useNavigate();

    const redirectToGroup = () => {
        navigate(`/${groupId}`);
    };

    const writeUrlToClipboard = () => {
        navigator.clipboard.writeText(getUrl(groupId))
    }

    const writeMessageToClipboard = () => {
        navigator.clipboard.writeText(getGroupJoinMessage(groupTitle, groupId))
    }

    return (
        <div id="group_summary_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text headline_less_space">
                Deine neue Gruppe wurde erstellt.
            </div>

            <div id="url_text">
                {getUrl(groupId)}
                <IconButton id="copy_icon" onClick={() => writeUrlToClipboard()}>
                    <ContentCopyIcon/>
                </IconButton>
            </div>
            <Button
                id="btn_copy_join_msg"
                variant="default"
                onClick={() => writeMessageToClipboard()}
            >
                Einladungsnachricht kopieren
            </Button>
            <div id="box_group_member_summary">
                <UserList
                    creator={creator}
                    users={groupMember}/>
            </div>
            <Button
                id="btn_join_group"
                variant="default"
                onClick={() => redirectToGroup()}
            >
                Zur Gruppe gehen
            </Button>

        </div>
    );
};

export default GroupSummary;
