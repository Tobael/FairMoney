import Button from "@mui/material/Button";
import "./GroupTitle.scss";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import Header from "../../../../components/Header/Header.jsx";


/**
 * View for adding the title of the group.
 *
 * @returns {JSX.Element} - The GroupTitle component.
 */
export default function GroupTitle({onNameSet, onBackClick}) {
    const [groupTitle, setGroupTitle] = useState("");
    const [isValidGroupTitle, setValidIsGroupTitle] = useState(false);

    /**
     * Handler for the title input field.
     */
    const handleInputChange = (event) => {
        setGroupTitle(event.target.value);
    };

    /**
     * Checks if the input fields are valid.
     */
    useEffect(() => {
        setValidIsGroupTitle(groupTitle.length >= 3 && groupTitle.length <= 30);
    }, [groupTitle]);

    return (
        <div id="group-title-container" className="default-page-container">
            <Header onBackClick={() => onBackClick()}/>
            <div className="headline-text">
                Wie möchtest du deine Gruppe nennen?
            </div>

            <TextField
                id="tf-question"
                fullWidth
                value={groupTitle}
                onChange={handleInputChange}
                variant="standard"
                error={!isValidGroupTitle && groupTitle !== ""}
                helperText={isValidGroupTitle || groupTitle === "" ? "" : "Bitte gib zwischen 3 und 30 Zeichen ein"}
                InputLabelProps={{shrink: true}}
            />
            <Button
                id="btn-name-set"
                variant="default"
                disabled={!isValidGroupTitle}
                onClick={() => onNameSet(groupTitle)}
            >
                Weiter
            </Button>
        </div>
    );
};
