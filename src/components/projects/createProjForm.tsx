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
import AssignPermissionsRoles from "./assignPermissionsRoles";
interface CreateProjectFormProps {
    setOpenCreateProjectPopup: (value: boolean) => void;
}
export default function CreateProjForm({ setOpenCreateProjectPopup }: CreateProjectFormProps) {
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [newRoleName, setNewRoleName] = useState<string>('');
    const [formStep, setFormStep] = useState<number>(1);
    const auth = useAuth();
    const proj = useProject();

    const formik = useFormik({
        initialValues: {
            name: '',
            roles: proj.roles as Role[],
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Project Name is required')

        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            proj.setLoadingCreateProject(true);
            const selectedRoleNames = selectedRoles.map(role => role.name);
            const response = await proj.registerProject({ name: values.name, roles: selectedRoleNames });

            if (response.success) {
                // setOpenCreateProjectPopup(false);
                setFormStep(2);
                console.log("Project created successfully");

                // resetForm();
            } else {
                console.log("Project creation failed");
                // proj.setLoadingCreateProject(false);
                setFieldError("name", response.message);
            }
            proj.setLoadingCreateProject(false);
        }
    });

    useEffect(() => {
        proj.getProjectsRoless();
    }, [proj.loadingCreateProject, auth.userData]);


    useEffect(() => {
        // add to the selectedroles the researcher and leader
        if (proj.roles) {
            const defaultRoles = proj.roles.filter(role => role.name === 'researcher' || role.name === 'leader');
            setSelectedRoles(defaultRoles);
        }
    }, [auth.userData, proj.roles]);
    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>
            {formStep === 1 && (<>
                <div className="flex justify-between">
                    <div className="  w-full flex flex-col h-fit items-start content-start mb-2">
                        <h4 className="text-sm font-bold text-[#ffffff4d] ">Project Name</h4>
                        <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                            <PersonIcon className=" text-white "></PersonIcon>

                            <input
                                type="text"
                                placeholder="Project Name"
                                className="w-full  h-fit pl-2  bg-transparent text-white"
                                name="name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                        </div>
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-xs text-start mt-1">{formik.errors.name}</div>
                        ) : null}
                    </div>

                </div>

                {/* <div className="flex justify-between">
                    <div className="  sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                        <h4 className="text-sm font-bold text-[#ffffff4d] ">Select Roles</h4>
                        <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                            <PasswordIcon className=" text-white "></PasswordIcon>

                            <select
                                className="w-full p-0 select priority-select bg-[#15283c] border-none focus:border-none text-white"
                                onChange={(e) => {
                                    const role = proj.roles?.find(r => r.name === e.target.value);
                                    if (role && !selectedRoles.some(r => r.id === role.id)) {
                                        const updated = [...selectedRoles, role];
                                        setSelectedRoles(updated);
                                        formik.setFieldValue("roles", updated);
                                    }
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>Select roles</option>
                                {proj.roles?.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>

                    <div className="  sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                        <h4 className="text-sm font-bold text-[#ffffff4d] ">Role</h4>
                        <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">


                            <input
                                type="text"
                                placeholder="Add a new role to select"
                                className="w-full h-fit pl-2 bg-transparent text-white"
                                name="role"
                                onChange={(e) => setNewRoleName(e.target.value)}
                                value={newRoleName}
                            />
                            <AddIcon
                                onClick={() => {
                                    if (newRoleName.trim()) {
                                        proj.createRoles(newRoleName.trim());
                                        setNewRoleName(''); // clear only after adding
                                    }
                                }}
                                className="text-white cursor-pointer"
                            />

                        </div>

                    </div>


                </div> */}

                <div className="w-full flex flex-wrap gap-2 mt-2">
                    <h4 className="w-full text-sm font-bold text-[#ffffff4d] ">Roles</h4>
                    {
                        selectedRoles.length > 0 && selectedRoles.map((role) => (
                            <div className="text-xs text-white mt-1 border-2 p-3 rounded-md" key={role.id}>
                                {role.name}
                                {role.name !== 'researcher' && role.name !== 'leader' &&
                                    <span className="text-red-500 cursor-pointer" onClick={() => {
                                        setSelectedRoles(selectedRoles.filter(r => r.id !== role.id));
                                        formik.setFieldValue("roles", selectedRoles.filter(r => r.id !== role.id));
                                    }}> x</span>
                                }
                            </div>
                        ))
                    }
                </div>

                <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                    <button type="submit" className="text-white text-lg sm:w-fit w-full sm:px-8 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">Create</button>

                </div>
            </>)}
            {formStep === 2 && (<AssignPermissionsRoles setOpenCreateProjectPopup={setOpenCreateProjectPopup} projectName={formik.values.name} ></AssignPermissionsRoles>)}
        </form>
    )
} 