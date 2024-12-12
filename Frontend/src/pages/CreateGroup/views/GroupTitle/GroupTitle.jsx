import Button from "@mui/material/Button";
import "./GroupTitle.scss";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import Header from "../../../../components/Header/Header.jsx";

const GroupTitle = ({onNameSet, onBackClick}) => {
    const [groupTitle, setGroupTitle] = useState("");
    const [isValidGroupTitle, setValidIsGroupTitle] = useState(false);

    const handleInputChange = (event) => {
        setGroupTitle(event.target.value);
    };

    useEffect(() => {
        setValidIsGroupTitle(groupTitle.length >= 3 && groupTitle.length <= 30);
    }, [groupTitle]);

    return (
        <div id="group_title_container" className="default_page_container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline_text">
                Wie möchtest du deine Gruppe nennen?
            </div>

            <TextField
                id="tf_question"
                fullWidth
                value={groupTitle}
                onChange={handleInputChange}
                variant="standard"
                error={!isValidGroupTitle && groupTitle !== ""}
                helperText={isValidGroupTitle || groupTitle === "" ? "" : "Bitte gib zwischen 3 und 30 Zeichen ein"}
                InputLabelProps={{shrink: true}}
            />
            <Button
                id="btn_name_set"
                variant="default"
                disabled={!isValidGroupTitle}
                onClick={() => onNameSet(groupTitle)}
            >
                Weiter
            </Button>
        </div>
    );
};
export default GroupTitle;
