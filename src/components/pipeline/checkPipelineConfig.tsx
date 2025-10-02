import { useEffect, useState } from "react";
import { usePipeline } from "../../context/pipelineProvider";
import { ConfigureValidation } from "../../api/pipeline";

interface CheckPipelineConfigProps {
    pipelineName?: string;
}

export default function CheckPipelineConfig({ pipelineName }: CheckPipelineConfigProps) {
    const { checkConfigStatus } = usePipeline();
    const [status, setStatus] = useState<ConfigureValidation | null>(null);
    const [error, setError] = useState<string | null>(null);

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
        </div>
    );
}
