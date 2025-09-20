/**
 * Author:
 * - Mahdi El Dirani s233031
 * 
 * Description:
 * Add Member Form
 */
import { useFormik } from "formik";
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import { useAuth } from "../../auth/authProvider";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { useUser } from "../../context/usersProvides";
// import { useUsers } from "../../auth/usersProvider";

interface CreateUserFormProps {
    setOpenAddMemberPopup: (value: boolean) => void;
}

interface SignupResponse {
    message: string;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ setOpenAddMemberPopup }) => {
    const auth = useUser();
    const auth2 = useAuth();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            passwordHash: '',
            orgRole: 'MEMBER',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            // passwordHash: Yup.string().required('Password is required').matches(
            //     /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            //     'Password must contain at least one numeric value, one special character, one uppercase letter, one lowercase letter, and at least 8 characters'
            // ),
            passwordHash: Yup.string().required('Password is required'),
            email: Yup.string().required('Email is required').email('Invalid email format'),
            orgRole: Yup.string().required('Role is required')

        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            // console.log(values)
            // const error = await auth?.signupAction(values) as SignupResponse;
            // console.log(error, "I am error")
            // if (error?.result) {
            //     if (error?.result?.succeeded) {

            //         setOpenAddMemberPopup(false)
            //     }
            //     else if (!error?.result?.succeeded) {
            //         console.log("usernmamm: ", error?.result)
            //         alert("Username is already used")
            //         resetForm()
            //     }
            // }
            // else {
            //     alert("Fetch error")
            //     resetForm()
            // }

            auth.setLoadingRegister(true)
            const response = await auth.registerUser(
                {
                    username: values.username,
                    email: values.email,
                    passwordHash: values.passwordHash,
                    orgRole: values.orgRole
                });
            if (response === "User registered successfully.") {
                setOpenAddMemberPopup(false)
                auth.setLoadingRegister(false)
            }
            else {
                if (typeof response === "string") {
                    if (response.includes("Email")) {
                        setFieldError("email", "Email is already in use");
                    } else if (response.includes("Username")) {
                        setFieldError("username", "Username is already in use");
                    } else {
                        alert("Registration failed: " + response);
                    }

                    auth.setLoadingRegister(false);
                    // resetForm();
                }
                else {
                    alert(response)
                }
                // alert(response)
                auth.setLoadingRegister(false)
                // resetForm()
            }

        }
    });

    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>

            <div className="flex justify-between">
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">UserName</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full  h-fit pl-2  bg-transparent text-white"
                            name="username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                    </div>
                    {formik.touched.username && formik.errors.username ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.username}</div>
                    ) : null}
                </div>
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Email</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full  h-fit pl-2  bg-transparent text-white"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.email}</div>
                    ) : null}
                </div>
            </div>

            <div className="flex justify-between">
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Password</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PasswordIcon className=" text-white "></PasswordIcon>

                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full  h-fit pl-2  bg-transparent text-white"
                            name="passwordHash"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.passwordHash}
                        />
                    </div>
                    {formik.touched.passwordHash && formik.errors.passwordHash ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.passwordHash}</div>
                    ) : null}
                </div>
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Role</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <CardMembershipIcon className=" text-white "></CardMembershipIcon>

                        <select
                            // placeholder=""
                            className="w-full p-0 select priority-select  bg-[#15283c] border-none focus:border-none text-white"
                            name="orgRole"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.orgRole}
                            aria-label="Project status">
                            {/* {auth2?.user?.role === "SuperAdmin" &&
                            <option value="Superadmin">Super Admin</option>
                            } */}
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                        </select>
                    </div>
                    {formik.touched.orgRole && formik.errors.orgRole ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.orgRole}</div>
                    ) : null}
                </div>
            </div>

            <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                <button type="submit" className="text-white text-xl sm:w-fit w-full sm:px-10 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">ADD</button>
            </div>
        </form>
    )
}
export default CreateUserForm;