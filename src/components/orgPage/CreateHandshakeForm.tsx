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
import { useOrg } from "../../context/orgsProvider";
// import { useUsers } from "../../auth/usersProvider";

interface CreateHandshakeFormProps {
    setOpenHandshakePopup: (value: boolean) => void;
}

interface SignupResponse {
    message: string;
}

const CreateHandshakeForm: React.FC<CreateHandshakeFormProps> = ({ setOpenHandshakePopup }) => {
    const auth = useAuth();
    const org = useOrg();

    const formik = useFormik({
        initialValues: {
            orgName: '',
        },
        validationSchema: Yup.object({
            orgName: Yup.string().required('Organization Name is required')

        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            org.setLoadingHandshake(true);

            const response = await org.handshakeRequest({ orgName: values.orgName });

            if (response.success) {
                setOpenHandshakePopup(false);
                resetForm();
            } else {
                setFieldError("orgName", response.message);
            }

            org.setLoadingHandshake(false);
        }
    });

    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>

            <div className="flex justify-between">
                <div className="  w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">OrgName</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <input
                            type="text"
                            placeholder="Organization Name"
                            className="w-full  h-fit pl-2  bg-transparent text-white"
                            name="orgName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.orgName}
                        />
                    </div>
                    {formik.touched.orgName && formik.errors.orgName ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.orgName}</div>
                    ) : null}
                </div>

            </div>

            <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                <button type="submit" className="text-white text-lg sm:w-fit w-full sm:px-8 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">Handhsake</button>

            </div>
        </form>
    )
}
export default CreateHandshakeForm;