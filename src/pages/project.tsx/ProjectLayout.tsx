import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Members from "./members";
import { use, useEffect, useState } from "react";
import { useAuth } from "../../auth/authProvider";
import { useProject } from "../../context/projectProvider";

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
        <>
            <Routes>
                <Route path="/" element={<Navigate to="members" />} />
                <Route path="members" element={<Members />} />
                {/* <Route path="partners" element={<Partners />} />
                    <Route path="processing-elements" element={<ProcessingElements />} />
                    <Route path="access-requests" element={<AccessRequestPage />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:projectName/*" element={<ProjectLayout />} /> */}
            </Routes>
        </>
    )
}