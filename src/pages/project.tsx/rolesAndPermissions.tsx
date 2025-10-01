
import { use, useEffect, useState } from "react";
// import AddPeButton from "../components/pePage/addPeButton";

import pe1 from "../../imgs/pe-profiles/pe-1.png"
import pe2 from "../../imgs/pe-profiles/pe-2.png"
import pe3 from "../../imgs/pe-profiles/pe-3.png"
import pe4 from "../../imgs/pe-profiles/pe-4.png"
import pe5 from "../../imgs/pe-profiles/pe-5.png"
// import { useAuth } from "../auth/authProvider";
// import { Project } from "../api/project";
// import { useProject } from "../context/projectProvider";
// import CreateProjBtn from "../components/projects/createProjBtn";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { useProject } from "../../context/projectProvider";
import BtnPopup from "../../components/shared/btnPopup";
import Permissions from "../../components/rolesAndPermissions/permissions";
import AddRoleForm from "../../components/rolesAndPermissions/addRoleForm";

export default function RolesAndPermissions() {
    const [closePopupState, setClosePopupState] = useState(false);
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const projectName = pathname.split("/")[3];
    const auth = useAuth();
    const proj = useProject();
    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        // fetch members of the project using projectName
        if (projectName) {
            proj.getProjectRolePermActionss(projectName);
        }
    }, [auth.userData, projectName, proj.loadingCreateProject]);


    function randomeProfile() {
        const profiles = [pe1, pe2, pe3, pe4, pe5];
        const randomIndex = Math.floor(Math.random() * profiles.length);
        return profiles[randomIndex];
    }

    const uniqueRoles = proj.projectRolesPermActions
        ? proj.projectRolesPermActions.filter(
            (item, index, self) =>
                index === self.findIndex((r) => r.roleName === item.roleName)
        )
        : [];

    function closePopup() {
        setClosePopupState(true);
    }


    return (
        // lg:mt-[5%] sm:mt-[10%] mt-[12%]
        <div className="w-full h-screen overflow-y-auto pb-10">
            <div className="w-full bg-white md:p-7 p-5 shadow-md  flex justify-between">
                <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
                <BtnPopup closePopupState={closePopupState} title={"New Role"} btnText={"Add New Role"} dialogClassName={"2xl:w-[40%] lg:w-[60%] md:w-[70%]"} >
                    <AddRoleForm closePopup={closePopup} />
                </BtnPopup>
            </div>
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 2xl:gap-6 gap-4  px-3 mt-5">
                {uniqueRoles.map((role) => (
                    <div key={role.roleName} className="bg-white 2xl:p-5 p-3 h-40 flex items-center shadow-md rounded-md">
                        <img
                            className="2xl:w-24 2xl:h-24 md:w-16 md:h-16 "
                            src={randomeProfile()}
                        />
                        <div className="2xl:text-xl xl:text-lg 2xl:ml-2 ml-5">
                            <p className="font-medium">{role.roleName}</p>
                            <BtnPopup title={role.roleName} btnText={"open"} dialogClassName={""}  className={"px-2 py-1 text-base"}>
                                <Permissions roleName={role.roleName} projectName={projectName} />
                            </BtnPopup>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}
