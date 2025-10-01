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
import { Role } from "../../api/project";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from "react-router-dom";
export default function AddRoleForm( {closePopup}: {closePopup: () => void} ) {
    const location = useLocation();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [newRoleName, setNewRoleName] = useState<string>('');
    const auth = useAuth();
    const proj = useProject();
    const [pathname, setPathname] = useState(location.pathname);
    const projectName = pathname.split("/")[3];



    useEffect(() => {
        setPathname(location.pathname);
        console.log(location.pathname);
    }, [location.pathname]);

    const formik = useFormik({
        initialValues: {
            roleName: '',
            projectName: projectName,
            permissions: proj.permissions as string[],
        },
        validationSchema: Yup.object({
            projectName: Yup.string().required('Project Name is required'),
            roleName: Yup.string().required('Role Name is required'),
            permissions: Yup.array().min(1, 'At least one permission is required')

        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            proj.setLoadingCreateProject(true);
            // const selecte?dRoleNames = selectedRoles.map(role => role);
            const response = await proj.assignCustomizedRole({ projectName: values.projectName, roleName: values.roleName, permissions: values.permissions });

            if (response.success) {
                closePopup();
                // setFormStep(2);
                console.log("Customized role created successfully");

                // resetForm();
            } else {
                console.log("Customized role creation failed");
                // proj.setLoadingCreateProject(false);
                setFieldError("roleName", response.message);
            }
            proj.setLoadingCreateProject(false);
        }
    });

    useEffect(() => {
        proj.getProjectsRoless();
        proj.getPerm();
    }, [proj.loadingCreateProject, auth.userData]);


    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>

            <div className="flex justify-between">
                <div className="  w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Role Name</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <input
                            type="text"
                            placeholder="Role Name"
                            className="w-full  h-fit pl-2  bg-transparent text-white"
                            name="roleName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.roleName}
                        />
                    </div>
                    {formik.touched.roleName && formik.errors.roleName ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.roleName}</div>
                    ) : null}
                </div>

            </div>

            <div className="flex justify-between">
                <div className="  sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Select Permissions</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PasswordIcon className=" text-white "></PasswordIcon>

                        <select
                            
                            className="w-full p-0 select priority-select bg-[#15283c] border-none focus:border-none text-white max-h-11"
                            onChange={(e) => {
                                const role = e.target.value;

                                // prevent duplicates
                                if (!selectedRoles.includes(role)) {
                                    const updated = [...selectedRoles, role];
                                    setSelectedRoles(updated);
                                    formik.setFieldValue("permissions", updated); // also fix: should match your schema
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Permissions</option>
                            {proj.permissions?.map((permission) => (
                                <option key={permission} value={permission}>
                                    {permission}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

            </div>

            <div className="w-full flex flex-wrap gap-2 mt-2">
                <h4 className="w-full text-sm font-bold text-[#ffffff4d] ">Permissions</h4>
                {
                    selectedRoles.length > 0 && selectedRoles.map((role) => (
                        <div className="text-xs text-white mt-1 border-2 p-3 rounded-md" key={role}>
                            {role}
                            {
                                <span className="text-red-500 cursor-pointer" onClick={() => {
                                    setSelectedRoles(selectedRoles.filter(r => r !== role));
                                    formik.setFieldValue("roles", selectedRoles.filter(r => r !== role));
                                }}> x</span>
                            }
                        </div>
                    ))
                }
            </div>

            <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                <button type="submit" className="text-white text-lg sm:w-fit w-full sm:px-8 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">Create</button>

            </div>

            {proj.loadingCreateProject &&
                        <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                            <div className="loader "></div>
                        </div>
                    }

            {/* {formStep === 2 && (<AssignPermissionsRoles setOpenCreateProjectPopup={setOpenCreateProjectPopup} projectName={formik.values.name} ></AssignPermissionsRoles>)} */}
        </form>
    )
}