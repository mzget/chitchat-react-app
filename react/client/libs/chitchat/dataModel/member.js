class Member {
    constructor() {
        this.role = MemberRole.member;
    }
}
var MemberRole;
(function (MemberRole) {
    MemberRole[MemberRole["member"] = 0] = "member";
    MemberRole[MemberRole["admin"] = 1] = "admin";
})(MemberRole || (MemberRole = {}));
