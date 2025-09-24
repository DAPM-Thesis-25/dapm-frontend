import { useFormik } from "formik";
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import { useAuth } from "../../auth/authProvider";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { useUser } from "../../context/usersProvides";

import { useOrg } from "../../context/orgsProvider";
import { useAccessRequest } from "../../context/accessRequestsProvider";
import { AccessRequest } from "../../api/accessRequests";
import { access } from "fs";
interface CreateHandshakeFormProps {
    setOpenTakeDecisionPopup: (value: boolean) => void;
    accessREq: AccessRequest;
}
export default function TakeDecisionForm({ setOpenTakeDecisionPopup, accessREq }: CreateHandshakeFormProps) {
    const auth = useAuth();
    const req = useAccessRequest();
    console.log(accessREq);

    const formik = useFormik({
        initialValues: {
            requestId: accessREq.id,
            decision: ''
        },
        validationSchema: Yup.object({
            requestId: Yup.string().required('Request ID is required'),
            decision: Yup.string().required('Decision is required')
        }),
        onSubmit: async (values, { resetForm, setFieldError }) => {
            req.setTakingDecisionLoading(true);

            const response = await req.takeDecisionOnRequest(
                {
                    requestId: values.requestId,
                    status: values.decision as "APPROVED" | "REJECTED"
                });

                console.log(response);

            if (response === undefined) {
                setOpenTakeDecisionPopup(false);
                req.setTakingDecisionLoading(false);
                resetForm();
            } else {
                setFieldError("orgName", response || "Take Decision failed");
            }
            req.setTakingDecisionLoading(false);
            setOpenTakeDecisionPopup(false);
        }
    });

    async function handleRevoke() {
        if (accessREq.id) {
            req.setTakingDecisionLoading(true);
            const response = await req.revokeRequest(accessREq.id);
            if (response === undefined) {
                setOpenTakeDecisionPopup(false);
                req.setTakingDecisionLoading(false);
            } else {
                alert("Revoke Access Request failed: "+ response);
            }
            setOpenTakeDecisionPopup(false);
            req.setTakingDecisionLoading(false);
        }
    }

    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>
            <div className="flex justify-between w-full">
                <div className="  sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Requester Org</h4>
                    <div className="border-2 h-fit relative p-1  w-full  flex items-center sm:rounded-none rounded-md">
                        <p className="w-full p-0 select priority-select  bg-[#15283c] text-white">{accessREq.organization}</p>
                    </div>
                </div>
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Requested PE</h4>
                    <div className="border-2 h-fit relative p-1  w-full  flex items-center sm:rounded-none rounded-md">
                        <p className="w-full p-0 select priority-select  bg-[#15283c] text-white">{accessREq.templateId}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-full">


                <div className="  sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Requested Hours</h4>
                    <div className="border-2 h-fit relative p-1  w-full  flex items-center sm:rounded-none rounded-md">
                        <p className="w-full p-0 select priority-select  bg-[#15283c] text-white">{accessREq.requestedDurationHours}</p>
                    </div>
                </div>
                {accessREq.status !== "PENDING" && (
                    <div className="  sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                        <h4 className="text-sm font-bold text-[#ffffff4d] ">Status</h4>
                        <div className="border-2 h-fit relative p-1  w-full  flex items-center sm:rounded-none rounded-md">
                            <p className="w-full p-0 select priority-select  bg-[#15283c] text-white">{accessREq.status}</p>
                        </div>
                    </div>
                )
                }

            </div>
            {accessREq.status === "PENDING" && (
                <>
                    <div className="flex justify-between w-full">
                        <div className="  w-full flex flex-col h-fit items-start content-start mb-2">
                            <h4 className="text-sm font-bold text-[#ffffff4d] ">Decision</h4>
                            <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                                {/* <PasswordIcon className=" text-white "></PasswordIcon> */}

                                <select
                                    // placeholder=""
                                    className="w-full p-0 select priority-select  bg-[#15283c] border-none focus:border-none text-white"
                                    name="decision"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.decision}
                                    aria-label="Project status">
                                    <option value="">Select Decision</option>
                                    <option value="APPROVED">Approve</option>
                                    <option value="REJECTED">Reject</option>
                                </select>
                            </div>
                            {formik.touched.decision && formik.errors.decision ? (
                                <div className="text-red-500 text-xs text-start mt-1">{formik.errors.decision}</div>
                            ) : null}
                        </div>

                    </div>
                    <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                        <button type="submit" className="text-white text-lg sm:w-fit w-full sm:px-8 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">Confirm</button>

                    </div>
                </>
            )
            }

            {accessREq.status === "APPROVED" && (
                <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                    <button type="button" onClick={() => handleRevoke()} className="text-white text-lg sm:w-fit w-full sm:px-8 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">REVOKE</button>

                </div>
            )}



        </form>
    )
}
