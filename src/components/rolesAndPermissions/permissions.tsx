import { use, useEffect } from "react";
import { useAuth } from "../../auth/authProvider";
import { useProject } from "../../context/projectProvider";

export default function Permissions({ roleName, projectName }: { roleName: string, projectName: string }) {
    const auth = useAuth();
    const proj = useProject();
    useEffect(() => {
        // fetch members of the project using projectName
        if (projectName) {
            proj.getProjectRolePermActionsByRolee(projectName, roleName);
        }
    }, [auth.userData, projectName, proj.loadingCreateProject]);
    return (
        <div className="w-full flex flex-wrap gap-2 mt-8">
            <h4 className="w-full sm:text-2xl text-2xl font-bold text-[#ff5722] sm:mt-0 mt-10">Permissions</h4>
            {
                proj.projectRolePermActions ? proj.projectRolePermActions.length > 0 && proj.projectRolePermActions.map((role) => (

                    <div className="text-xs text-white mt-1 border-2 p-3 rounded-md" key={role.roleName + role.action}>
                        {role.action}
                    </div>

                ))
                    : <p className="text-sm text-white">No permissions</p>}
        </div>
    );
}