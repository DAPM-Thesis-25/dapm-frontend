import { useEffect, useState } from "react";
import { usePipeline } from "../../context/pipelineProvider";
import { ConfigureValidation } from "../../api/pipeline";
import { useProject } from "../../context/projectProvider";
import { Navigate, useLocation, useNavigate } from "react-router";

interface CheckPipelineConfigProps {
    pipelineName?: string;
}

export default function CheckPipelineConfig({ pipelineName }: CheckPipelineConfigProps) {
    const { checkConfigStatus } = usePipeline();
    const [status, setStatus] = useState<ConfigureValidation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const proj = useProject();
    const location = useLocation();

    // derive projectName like your other screens do
    const pathname = location.pathname;
    const projectName = pathname.split("/")[3] || "default";
    const navigate = useNavigate();

    useEffect(() => {
        if (!pipelineName) return;
        const orgDomainName = localStorage.getItem("domain") || "8081";
        checkConfigStatus(orgDomainName, pipelineName)
            .then(setStatus)
            .catch((err) => {
                console.error("❌ Failed to check config:", err);
                setError(err.response?.data || "Unknown error");
            });
    }, [pipelineName]);

    if (!pipelineName) return <div>No pipeline selected</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!status) return <div>Loading configuration…</div>;

    return (
        <div>
            <p className="text-sm text-[#ffffff4d] py-4">
                A leader needs to request the following permissions to configure the pipeline
            </p>

            {status.missingPermissions.length > 0 && (
                <div>
                    <div className="text-white text-xl">
                        {status.missingPermissions.map((m, idx) => (
                            <p className="mb-2" key={idx}> <span className="font-bold text-[#ff5722]">{m.templateName}</span>  from {m.organizationName}</p>
                        ))}

                    </div>
                </div>
            )}
            {
                proj.projectRolePermActions?.some(
                    (perm) => perm.action === "VALIDATE_PIPELINE"
                ) ?
                    (
                        <div className="w-full flex justify-center">
                            <button
                                onClick={() => navigate(`/dashboard/projects/${projectName}/access-requests`)}
                                className="bg-[#ff5722] text-white px-4 py-2 rounded mt-4 hover:bg-[#e64a19]"
                            >
                                Go to access request
                            </button>
                        </div>
                    )
                    : true
            }
        </div>
    );
}
