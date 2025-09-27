import { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Users from "./users";
import Partners from "./partners";
import ProcessingElements from "./processingElements";
import AccessRequests from "./accessRequest";
import AccessRequestPage from "./accessRequest";
import Projects from "./projects";
import ProjectLayout from "./project.tsx/ProjectLayout";

export default function Dashboard() {
    const [size, setSize] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSize(true)
                setIsOpen(false)
            }
            else {
                setSize(false)
                setIsOpen(true)
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="h-screen md:flex md:justify-between ">
            <SideBar isOpen={isOpen} size={size} setIsOpen={setIsOpen} />
            <div className={`grow flex flex-col h-full  transition-all duration-300 ease-in-out `}>

                <Navbar isOpen={isOpen} setIsOpen={setIsOpen} size={size} />
                <Routes>
                    <Route path="/" element={<Navigate to="users" />} />
                    <Route path="users" element={<Users />} />
                    <Route path="partners" element={<Partners />} />
                    <Route path="processing-elements" element={<ProcessingElements />} />
                    <Route path="access-requests" element={<AccessRequestPage />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:projectName/*" element={<ProjectLayout />} />
                </Routes>
            </div>
        </div>
    )
}