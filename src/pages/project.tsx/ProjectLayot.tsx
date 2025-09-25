import { Routes, useParams } from "react-router-dom";

export default function ProjectLayout() {
    const { projectName } = useParams();
    return (
        <>
            <Routes>
                {/* <Route path="/" element={<Navigate to="users" />} />
                    <Route path="users" element={<Users />} />
                    <Route path="partners" element={<Partners />} />
                    <Route path="processing-elements" element={<ProcessingElements />} />
                    <Route path="access-requests" element={<AccessRequestPage />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:projectName/*" element={<ProjectLayout />} /> */}
            </Routes>
        </>
    )
}