import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Members from "./members";
import { use, useEffect, useState } from "react";
import { useAuth } from "../../auth/authProvider";
import { useProject } from "../../context/projectProvider";
import PipelineBuilder from "./pipeline";
import Pipelines from "./pipeline";
import PipelineDesign from "../../components/pipeline/pipelineDesign";
import RolesAndPermissions from "./rolesAndPermissions";
import PipelineResults from "./pipelineResults";
import InetrnalAccessRequestPage from "./accessRequests";

export default function ProjectLayout() {
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const projectName = pathname.split("/")[3];
    const auth = useAuth();
    const proj = useProject();
    useEffect(() => {
        setPathname(location.pathname);
        console.log(location.pathname);
        console.log(auth.token)
    }, [location.pathname]);

    useEffect(() => {
        if (auth.userData) {
            console.log("User Data:", auth.userData);
            console.log("Project Name:", projectName);
            const projectRole = auth.userData.projectRoles.find(
                (pr) => pr.project === projectName
            );

            if (projectRole) {
                proj.getProjectRolePermActionsByRolee(projectName, projectRole.role);
            } else {
                console.warn(`No role found for project: ${projectName}`);
            }
        }
    }, [auth.userData, projectName]);


    return (
        <div className="w-full h-screen overflow-hidden">
            <Routes>
                <Route path="/" element={<Navigate to="pipelines" />} />
                <Route path="members" element={<Members />} />
                <Route path="roles-permissions" element={<RolesAndPermissions />} />
                <Route path="pipelines" element={<Pipelines />} />
                <Route path="access-requests" element={<InetrnalAccessRequestPage />} />
                <Route path="pipelines/:name" element={<PipelineDesign />} />
                <Route path="pipelines/:name/view-result" element={<PipelineResults />} />

            </Routes>
        </div>
    )
}