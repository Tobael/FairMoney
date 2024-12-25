import "./CreateGroup.scss";
import React from "react";
import GroupTitle from "./views/GroupTitle/GroupTitle.jsx";
import GroupCreator from "./views/GroupCreator/GroupCreator.jsx";
import GroupMember from "./views/GroupMember/GroupMember.jsx";
import GroupSummary from "./views/GroupSummary/GroupSummary.jsx";
import LandingPage from "./views/LandingPage/LandingPage.jsx";
import {CreateGroupViews} from "../../shared/enums.js";


/**
 * Page to create a group
 *
 * @returns {JSX.Element} - The CreateGroupView component.
 */
export default function CreateGroupView() {
    const [show, setCurrentView] = React.useState(CreateGroupViews.LandingPage);
    const [group, setGroup] = React.useState({
        title: null,
        creator: {name: null, paypal: null},
        members: [],
    });
    const [groupId, setGroupId] = React.useState("");

    /**
     * Resets the group creation process, when user clicks the back arrow.
     */
    const resetGroupCreation = () => {
        setGroup({
            title: null,
            creator: {name: null, paypal: null},
            members: [],
        });
        setGroupId("");
        setCurrentView(CreateGroupViews.LandingPage);
    }

    return (
        <div id="create-group-wrapper">
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
                    group={group}
                    onBackClick={() => resetGroupCreation()}
                    onGroupCreated={(group, groupId) => {
                        setGroup(group);
                        setGroupId(groupId);
                        setCurrentView(CreateGroupViews.GroupSummary);
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


