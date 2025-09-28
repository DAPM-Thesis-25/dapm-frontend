import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/authProvider';
import { useProject } from '../../context/projectProvider';
import { usePipeline } from '../../context/pipelineProvider';
import { getValidatedPipeline } from '../../api/pipeline';
export default function PipelineNavbar() {
    const nav = useNavigate();
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const pipelineName = pathname.split("/")[5];
    const auth = useAuth();
    const { pipelines, validatePipeline, loading } = usePipeline();

    // control graph state here so the right sidebar can update nodes
    const draft = useMemo(() => pipelines.find((p) => p.name === pipelineName), [pipelines, pipelineName]);

    useEffect(() => {
        setPathname(location.pathname);
        console.log(location.pathname);
        console.log(auth.token)
    }, [location.pathname]);
    return (
        <div className="w-full h-[8%] bg-[#214162] flex items-center   justify-between px-4 border-b-2 border-[#ff5722]">
            <div onClick={() => { nav(-1) }} className=" text-white flex cursor-pointer hover:text-white rounded-2xl  items-center">
                <ArrowBackIcon className="text-[#ff5722]"></ArrowBackIcon>
            </div>
            <div>
                <h1 className="text-white text-2xl font-semibold">{draft ? draft.name : (loading ? "Loading…" : "Pipeline not found")}</h1>
            </div>
            <div>
                {
                    draft && draft.status === "draft" && !loading ? (

                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={async () => {
                                if (!draft) return;
                                try {
                                    const orgDomainName = localStorage.getItem("domain") || "";
                                    const result = await validatePipeline(orgDomainName, draft);
                                    console.log("✅ Validation result:", result);
                                    // optional: update pipeline status or show a toast
                                } catch (err) {
                                    console.error("❌ Validation failed:", err);
                                }
                            }}
                        >
                            Validate
                        </button>
                    ) : draft && draft.status === "draft" && loading ? (
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
                            disabled
                        >
                            Validating...
                        </button>
                    ) : draft ? draft.status === "validated" ? (
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            // onClick={async () => {
                            //     if (!draft) return;
                            //     try {
                            //         const orgDomainName = localStorage.getItem("domain") || "";
                            //         const result = await validatePipeline(orgDomainName, draft);
                            //         console.log("✅ Validation result:", result);
                            //         // optional: update pipeline status or show a toast
                            //     } catch (err) {
                            //         console.error("❌ Validation failed:", err);
                            //     }
                            // }}
                        >
                            Build
                        </button>
                    ) : draft.status === "built" ? (
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            // onClick={async () => {
                            //     if (!draft) return;
                            //     try {
                            //         const orgDomainName = localStorage.getItem("domain") || "";
                            //         const result = await validatePipeline(orgDomainName, draft);
                            //         console.log("✅ Validation result:", result);
                            //         // optional: update pipeline status or show a toast
                            //     } catch (err) {
                            //         console.error("❌ Validation failed:", err);
                            //     }
                            // }}
                        >
                            Execute
                        </button>
                    ) : draft.status === "executing" ? (
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            // onClick={async () => {
                            //     if (!draft) return;
                            //     try {
                            //         const orgDomainName = localStorage.getItem("domain") || "";
                            //         const result = await validatePipeline(orgDomainName, draft);
                            //         console.log("✅ Validation result:", result);
                            //         // optional: update pipeline status or show a toast
                            //     } catch (err) {
                            //         console.error("❌ Validation failed:", err);
                            //     }
                            // }}
                        >
                            Terminate
                        </button>
                    ) : draft.status === "terminated" ? (
                        <span className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Status: {draft?.status}</span>
                    ) : null
                        : null
                }
            </div>
        </div>
    )
}