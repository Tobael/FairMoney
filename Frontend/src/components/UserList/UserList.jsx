import {Box} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import "./UserList.scss"

/**
 * Component for displaying a list of users in the group creation dialog.
 *
 * @returns {JSX.Element} - The HistoryItem component.
 */
export default function UserList({creator, users}) {
    /**
     *  Returns the display text for the names of the users in the group.
     */
    const getUserNames = () => {
        if (creator) {
            return [creator.name + " (Du)", ...users.map(user => user.name)];
        }
        return users.map(user => user.name);
    }

    return (
        <Box id="user-list-container">
            {getUserNames().map((userName) => (
                <div
                    key={userName}
                    className="user-label">
                    <PersonIcon className="person-icon"/>
                    {userName}
                </div>
            ))}
        </Box>
    );
};
