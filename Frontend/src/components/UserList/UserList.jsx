import {Box} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import "./UserList.scss"

export default function UserList({creator, users}) {
    const getUserNames = () => {
        if (creator) {
            return [creator.name + " (Du)", ...users.map(user => user.name)];
        }
        return users.map(user => user.name);
    }

    return (
        <Box id="user_list_container">
            {getUserNames().map((userName) => (
                <div
                    key={userName}
                    className="user_label">
                    <PersonIcon className="person_icon"/>
                    {userName}
                </div>
            ))}
        </Box>
    );
};
