/**
 * Enum for views in the Create Group process.
 * @readonly
 * @enum {number}
 */
export const CreateGroupViews = Object.freeze({
    LandingPage: 0,
    GroupTitle: 1,
    GroupCreator: 2,
    GroupMember: 3,
    GroupSummary: 4
});

/**
 * Enum for views in the Manage Group process.
 * @readonly
 * @enum {string|number}
 */
export const ManageGroupViews = Object.freeze({
    None: "none",
    GroupLogin: 1,
    GroupOverview: 2,
    GroupAddPayment: 3,
    GroupHistory: 4,
    GroupCreateAccounting: 5,
    GroupAccountingOverview: 6
});