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
import { usePE } from "../../context/processingElementsProvider";
// import { useUsers } from "../../auth/usersProvider";

interface CreateProcessingElementFormProps {
    setOpenAddProcessingElementPopup: (value: boolean) => void;
}

interface SignupResponse {
    message: string;
}

const CreateProcessingElement: React.FC<CreateProcessingElementFormProps> = ({ setOpenAddProcessingElementPopup }) => {
    const pe = usePE();

    const formik = useFormik({
        initialValues: {
            template: null as File | null,
            configSchema: null as File | null,
            tier: "",
            output: "",
            inputs: [] as string[],
        },
        validationSchema: Yup.object({
            template: Yup.mixed().required("Template file is required"),
            configSchema: Yup.mixed().required("Config schema file is required"),
            tier: Yup.string().required("Tier is required"),
            output: Yup.string().optional(),
            inputs: Yup.array().of(Yup.string()).optional(),
        }),
        onSubmit: async (values, { resetForm }) => {
            pe.setLoadingProcessingElement(true);

            const result = await pe.addProcessingElement({
                template: values.template!,
                configSchema: values.configSchema!,
                tier: values.tier as "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE",
                output: values.output || undefined,
                inputs: values.inputs,
            });

            if (result.success) {
                // alert("Processing Element uploaded successfully!");
                setOpenAddProcessingElementPopup(false);
                resetForm();
            } else {
                alert("Upload failed: " + result.message);
            }

            pe.setLoadingProcessingElement(false);
        },
    });


    return (
        <form className="flex  flex-col w-full py-1 signup" onSubmit={formik.handleSubmit}>

            <div className="flex justify-between flex-wrap">
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Template</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <input
                            type="file"
                            className="text-white"
                            name="template"
                            onChange={(e) => formik.setFieldValue("template", e.currentTarget.files?.[0] || null)}
                        />
                    </div>
                    {formik.touched.template && formik.errors.template ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.template}</div>
                    ) : null}
                </div>
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Config Schema</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PersonIcon className=" text-white "></PersonIcon>

                        <input
                            type="file"
                            name="configSchema"
                            className="text-white"
                            onChange={(e) => formik.setFieldValue("configSchema", e.currentTarget.files?.[0] || null)}
                        />
                    </div>
                    {formik.touched.configSchema && formik.errors.configSchema ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.configSchema}</div>
                    ) : null}
                </div>
            </div>

            <div className="flex justify-between flex-wrap">

                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Tier</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <CardMembershipIcon className=" text-white "></CardMembershipIcon>

                        <select
                            // placeholder=""
                            className="w-full p-0 select priority-select  bg-[#15283c] border-none focus:border-none text-white"
                            name="tier"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tier}
                            aria-label="Project status">
                            <option value="">Select Tier</option>
                            <option value="FREE">FREE</option>
                            <option value="BASIC">BASIC</option>
                            <option value="PREMIUM">PREMIUM</option>
                            <option value="PRIVATE">PRIVATE</option>
                        </select>
                    </div>
                    {formik.touched.tier && formik.errors.tier ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.tier}</div>
                    ) : null}
                </div>
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Output</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PasswordIcon className=" text-white "></PasswordIcon>

                        <select
                            // placeholder=""
                            className="w-full p-0 select priority-select  bg-[#15283c] border-none focus:border-none text-white"
                            name="output"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.output}
                            aria-label="Project status">
                            <option value="">Select Output</option>
                            <option value="Event">Event</option>
                            <option value="PetriNet">PetriNet</option>
                        </select>
                    </div>
                    {formik.touched.output && formik.errors.output ? (
                        <div className="text-red-500 text-xs text-start mt-1">{formik.errors.output}</div>
                    ) : null}
                </div>
            </div>

            <div className="flex justify-between flex-wrap">
                <div className=" sm:w-[48%] w-full flex flex-col h-fit items-start content-start mb-2">
                    <h4 className="text-sm font-bold text-[#ffffff4d] ">Inputs</h4>
                    <div className="signup-input h-fit relative border-2 p-1 border-white  w-full  flex items-center sm:rounded-none rounded-md">
                        <PasswordIcon className=" text-white mr-2"></PasswordIcon>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center text-white">
                                <input
                                    type="checkbox"
                                    value="Event"
                                    checked={formik.values.inputs.includes("Event")}
                                    onChange={(e) => {
                                        const { checked, value } = e.target;
                                        if (checked) {
                                            formik.setFieldValue("inputs", [...formik.values.inputs, value]);
                                        } else {
                                            formik.setFieldValue("inputs", formik.values.inputs.filter((v) => v !== value));
                                        }
                                    }}
                                />
                                <span className="ml-2">Event</span>
                            </label>

                            <label className="flex items-center text-white">
                                <input
                                    type="checkbox"
                                    value="PetriNet"
                                    checked={formik.values.inputs.includes("PetriNet")}
                                    onChange={(e) => {
                                        const { checked, value } = e.target;
                                        if (checked) {
                                            formik.setFieldValue("inputs", [...formik.values.inputs, value]);
                                        } else {
                                            formik.setFieldValue("inputs", formik.values.inputs.filter((v) => v !== value));
                                        }
                                    }}
                                />
                                <span className="ml-2">PetriNet</span>
                            </label>
                        </div>


                    </div>

                </div>
            </div>

            <div className="w-full flex items-end grow justify-self-end   justify-center mt-8">
                <button type="submit" className="text-white text-xl sm:w-fit w-full sm:px-10 p-2 px-6 bg-[#15283c] hover:bg-[#ff5722] border-2 border-white rounded-md">ADD</button>

            </div>
        </form>
    )
}
export default CreateProcessingElement;