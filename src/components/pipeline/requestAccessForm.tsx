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
import { useEffect, useState } from "react";
import { usePE } from "../../context/processingElementsProvider";
import { usePipeline } from "../../context/pipelineProvider";
import { useLocation } from "react-router-dom";
import { initiatePeerRequest, PipelineProcessingElementRequestDto } from "../../api/pipeline";
import { useAccessRequest } from "../../context/accessRequestsProvider";
// import { useUsers } from "../../auth/usersProvider";

interface RequestAccessFormProps {
    setOpenRequestAccessPopup: (value: boolean) => void;
}

interface SignupResponse {
    message: string;
}

const RequestAccessForm: React.FC<RequestAccessFormProps> = ({ setOpenRequestAccessPopup }) => {
    const auth = useUser();
    const auth2 = useAuth();
    const pe = usePE();
    const pipeline = usePipeline();
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const projectName = pathname.split("/")[3];
    const acc = useAccessRequest();

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        pe.getPes();
        pipeline.refreshPipelines(projectName);
    }, [projectName,auth2.userData])



    const formik = useFormik({
        initialValues: {
            processingElement: '',
            pipelineName: '',
            requestedDurationHours: 0
        },
        validationSchema: Yup.object({
            processingElement: Yup.string().required('Processing Element is required'),
            pipelineName: Yup.string().required('Pipeline Name is required'),
            requestedDurationHours: Yup.number().required('Requested Duration Hours is required').min(1, 'Must be at least 1 hour'),

        }),
        onSubmit: async (values, { resetForm, setSubmitting, setFieldError }) => {
            try {
                // Construct DTO
                const dto: PipelineProcessingElementRequestDto = {
                    processingElement: values.processingElement,
                    pipelineName: values.pipelineName,
                    requestedDurationHours: values.requestedDurationHours,
                };
                auth.setLoadingRegister(true);

                console.log("Submitting Request Access with DTO:", dto);
                // Call API
                const orgDomainName = localStorage.getItem("domain") || "";
                const response = await initiatePeerRequest(orgDomainName, dto);
                const data = response.data;

                // ✅ If successful
                // alert(`Request submitted! ID: ${data.requestId}, Status: ${data.requestStatus}`);
                auth.setLoadingRegister(false);
                resetForm();
                setOpenRequestAccessPopup(true);
            } catch (error: any) {
                console.error("Request Access Error:", error);
                auth.setLoadingRegister(false);

                if (error.response?.data?.error) {
                    // alert(`Failed: ${error.response.data.error}`);
                } else {
                    // alert("Failed to send request. Please try again.");
                }
            } finally {
                acc.getRequests();
                auth.setLoadingRegister(false);
                setSubmitting(false);
            }
        }

    });

    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>

            <div className="flex justify-between">
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Processing Element</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <select
                            // placeholder=""
                            className="w-full p-0 select priority-select  bg-[#15283c] border-none focus:border-none text-white"
                            name="processingElement"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.processingElement}
                            aria-label="Project status">
                            {/* {auth2?.user?.role === "SuperAdmin" &&
                            <option value="Superadmin">Super Admin</option>
                            } */}
                            <option value="">Select processing element</option>
                            {pe?.processingElements?.filter(pe => pe.ownerOrganization !== auth2.userData?.organizationName).map((pe) => (
                                <option key={pe.templateId} value={pe.templateId}>{pe.templateId}</option>
                            ))}
                        </select>
                    </div>
                    {formik.touched.processingElement && formik.errors.processingElement ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.processingElement}</div>
                    ) : null}
                </div>
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Pipeline</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <select
                            // placeholder=""
                            className="w-full p-0 select priority-select  bg-[#15283c] border-none focus:border-none text-white"
                            name="pipelineName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pipelineName}
                            aria-label="Project status">
                            {/* {auth2?.user?.role === "SuperAdmin" &&
                            <option value="Superadmin">Super Admin</option>
                            } */}
                            <option value="">Select pipeline</option>
                            {pipeline?.pipelines?.map((pe) => (
                                <option key={pe.id} value={pe.name}>{pe.name}</option>
                            ))}
                        </select>
                    </div>
                    {formik.touched.pipelineName && formik.errors.pipelineName ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.pipelineName}</div>
                    ) : null}
                </div>
            </div>

            <div className="flex justify-between">
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Requested Duration Hours</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PasswordIcon className=" text-white "></PasswordIcon>

                        <input
                            type="text"
                            placeholder="Requested Duration Hours"
                            className="w-full  h-fit pl-2  bg-transparent text-white"
                            name="requestedDurationHours"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.requestedDurationHours}
                        />
                    </div>
                    {formik.touched.requestedDurationHours && formik.errors.requestedDurationHours ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.requestedDurationHours}</div>
                    ) : null}
                </div>

            </div>

            <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                <button type="submit" className="text-white text-xl sm:w-fit w-full sm:px-10 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">Request</button>
            </div>
        </form>
    )
}
export default RequestAccessForm;