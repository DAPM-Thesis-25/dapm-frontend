import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Trash2, Plus, Play } from "lucide-react"; // optional icons; install lucide-react or swap for MUI
import { usePipeline } from "../../context/pipelineProvider";
// npm i lucide-react

export default function Pipelines() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pipelines, loading, refreshPipelines, createDraft, deleteDraft } = usePipeline();

    // derive projectName like your other screens do
    const pathname = location.pathname;
    const projectName = pathname.split("/")[3] || "default";

    useEffect(() => {
        if (projectName) refreshPipelines(projectName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectName]);

    const handleCreate = () => {
        const name = window.prompt("Enter a name for your new pipeline:");
        if (!name || !name.trim()) return; // user cancelled or empty name

        const p = createDraft(projectName, name.trim());
        navigate(`/dashboard/projects/${projectName}/pipelines/${p.name}`);
    };

    const openPipeline = (name: string) => {
        navigate(`/dashboard/projects/${projectName}/pipelines/${name}`);
    };



    return (
        <div className="w-full h-screen overflow-y-auto pb-10">
            <div className="w-full bg-white md:p-7 p-5 shadow-md flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Pipelines</h1>

                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-semibold px-4 py-2 rounded"
                >
                    <Plus size={18} />
                    New draft
                </button>
            </div>

            <div className="p-5 md:p-7">
                {loading ? (
                    <div className="text-gray-500">Loading pipelines…</div>
                ) : pipelines.length === 0 ? (
                    <div className="text-gray-500">No pipelines yet. Create your first draft.</div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {pipelines.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-lg shadow-md border p-4 flex flex-col justify-between"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">{p.name}</h3>
                                        <p className="text-sm text-gray-500">{p.projectName}</p>
                                    </div>

                                    {/* Status badge */}
                                    {p.status === "validated" ? (
                                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded">
                                            <CheckCircle size={14} /> Validated
                                        </span>
                                    ) 
                                    : p.status === "built" ? (
                                        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded">
                                            <Clock size={14} /> Built
                                        </span>
                                    )
                                    : p.status === "executing" ? (
                                        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded">
                                            <Clock size={14} /> Executing
                                        </span>
                                    )
                                    : p.status === "terminated" ? (
                                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 font-medium px-2 py-1 rounded">
                                            <Clock size={14} /> Terminated
                                        </span>
                                    )
                                    : p.status === "draft" ? (
                                        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded">
                                            <Clock size={14} /> Draft
                                        </span>
                                    )
                                        : (<span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 font-medium px-2 py-1 rounded">
                                            Unknown
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-gray-500 mt-2">
                                    Updated {new Date(p.updatedAt).toLocaleString()}
                                    <span className="ml-2">• {p.source === "remote" ? "from database" : "local"}</span>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <button
                                        onClick={() => openPipeline(p.name)}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#15283c] text-white hover:opacity-90"
                                    >
                                        <Play size={16} />
                                        Open
                                    </button>


                                    {p.source === "local" ? (
                                        <button
                                            onClick={() => deleteDraft(p.projectName, p.id)}
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded border text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    ) : (
                                        <div className="text-xs text-gray-400">read-only</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
