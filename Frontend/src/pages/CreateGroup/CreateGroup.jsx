import "./CreateGroup.scss";
import React, {useEffect} from "react";
import GroupTitle from "./views/GroupTitle/GroupTitle.jsx";
import GroupCreator from "./views/GroupCreator/GroupCreator.jsx";
import GroupMember from "./views/GroupMember/GroupMember.jsx";
import GroupSummary from "./views/GroupSummary/GroupSummary.jsx";
import LandingPage from "./views/LandingPage/LandingPage.jsx";
import {CreateGroupViews} from "../../shared/enums.js";
import {createGroup as createGroupBackend} from "../../shared/backend.js";
import {showErrorPage} from "../../shared/error.js";

const CreateGroupView = () => {
    const [show, setCurrentView] = React.useState(CreateGroupViews.LandingPage);
    const [group, setGroup] = React.useState({
        title: null,
        creator: {name: null, paypal: null},
        members: [],
    });
    const [groupId, setGroupId] = React.useState("");


    const resetGroupCreation = () => {
        setGroup({
            title: null,
            creator: {name: null, paypal: null},
            members: [],
        });
        setGroupId("");
        setCurrentView(CreateGroupViews.LandingPage);
    }

    useEffect(() => {
        const createGroup = async () => {
            const result = await createGroupBackend(group)
            if (result.ok) {
                const data = await result.json();
                setGroupId(data.uuid);
            } else {
                showErrorPage(result)
            }
        }

        if (group.creator.name && group.title && group.members.length > 0) {
            createGroup().then(() => {
                setCurrentView(CreateGroupViews.GroupSummary);
            });
        }
    }, [group]);

    return (
        <div id="create_group_wrapper">
            {show === CreateGroupViews.LandingPage && (
                <LandingPage
                    onNewGroup={() => {
                        setCurrentView(CreateGroupViews.GroupTitle);
                    }}
                />
            )}
            {show === CreateGroupViews.GroupTitle && (
                <GroupTitle
                    onBackClick={() => resetGroupCreation()}
                    onNameSet={(groupTitle) => {
                        setGroup((prevGroup) => ({
                            ...prevGroup,
                            title: groupTitle,
                        }));
                        setCurrentView(CreateGroupViews.GroupCreator);
                    }}
                />
            )}
            {show === CreateGroupViews.GroupCreator && (
                <GroupCreator
                    onBackClick={() => resetGroupCreation()}
                    onCreatorSet={(groupCreator) => {
                        setGroup((prevGroup) => ({
                            ...prevGroup,
                            creator: groupCreator,
                        }));
                        setCurrentView(CreateGroupViews.GroupMember);
                    }}
                />
            )}
            {show === CreateGroupViews.GroupMember && (
                <GroupMember
                    creator={group.creator}
                    onBackClick={() => resetGroupCreation()}
                    onMembersAdded={async (groupMembers) => {
                        setGroup((prevGroup) => ({
                            ...prevGroup,
                            members: groupMembers,
                        }));
                    }}
                />
            )}
            {show === CreateGroupViews.GroupSummary &&
                <GroupSummary
                    groupId={groupId}
                    groupTitle={group.title}
                    creator={group.creator}
                    groupMember={group.members}
                    onBackClick={() => resetGroupCreation()}/>}
        </div>
    );
};

export default CreateGroupView;
