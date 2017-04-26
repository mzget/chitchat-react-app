import * as React from "react";
import { EditGroupMember } from "./EditGroupMember";
import { EditGroupMemberEnhancer, IEnhanceProps } from "./EditGroupMemberEnhancer";

export const EditGroupMemberEnhanced = EditGroupMemberEnhancer(({
     room_id, members, updateMembers, onToggleItem, onSubmit, onFinished }: IEnhanceProps) =>
    <EditGroupMember
        members={members}
        onToggleItem={onToggleItem}
        onSubmit={onSubmit} />
) as React.ComponentClass<{ room_id, members, match, onFinished }>;