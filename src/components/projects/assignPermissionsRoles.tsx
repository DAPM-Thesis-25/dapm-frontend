import { useFormik } from "formik";
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import { useAuth } from "../../auth/authProvider";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { useUser } from "../../context/usersProvides";
import { useOrg } from "../../context/orgsProvider";
import { useProject } from "../../context/projectProvider";
import { useEffect, useState } from "react";
import { ProjectPermAction, Role } from "../../api/project";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
export default function AssignPermissionsRoles({ setOpenCreateProjectPopup, projectName }: { setOpenCreateProjectPopup: (value: boolean) => void; projectName: string; }) {
    // const [roles, setRoles] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<ProjectPermAction[] | null>(null);
    const auth = useAuth();
    const proj = useProject();
    useEffect(() => {
        proj.getProjectRolePermActionss(projectName);
    }, [auth.userData]);

    useEffect(() => {
        if (proj.projectRolesPermActions) {
            setSelectedRoles(proj.projectRolesPermActions);
        }
    }, [proj.projectRolesPermActions]);

    return (
        <div className="">
            <h2 className="sm:text-2xl text-xl font-bold mb-2 sm:mt-0 mt-5 text-[#ff5722]">Assigned Permissions</h2>
            <p className="text-sm text-[#ffffff4d]">These are the default permissions assigned to the 2 main roles in the project {projectName}. You can add more permissions to your custom roles later from the project page.
            </p>
            <div className="w-full flex flex-wrap gap-2 mt-8">
                <h4 className="w-full sm:text-xl text-base font-semibold text-white">Leader Permissions</h4>
                {
                    selectedRoles ? selectedRoles.length > 0 && selectedRoles.map((role) => (
                        role.roleName === "leader" ? 
                        <div className="text-xs text-white mt-1 border-2 p-3 rounded-md" key={role.roleName + role.action}>
                            {role.action}
                        </div>
                        : null
                    ))
                        : <p className="text-sm text-white">No permissions selected</p>}
            </div>
            <div className="w-full flex flex-wrap gap-2 mt-8">
                <h4 className="w-full sm:text-xl text-base font-semibold text-white">Researcher Permissions</h4>
                {
                    selectedRoles ? selectedRoles.length > 0 && selectedRoles.map((role) => (
                        role.roleName === "researcher" ? 
                        <div className="text-xs text-white mt-1 border-2 p-3 rounded-md" key={role.roleName + role.action}>
                            {role.action}
                        </div>
                        : null
                    ))
                        : <p className="text-sm text-white">No permissions selected</p>}
            </div>
        </div>
    )
}