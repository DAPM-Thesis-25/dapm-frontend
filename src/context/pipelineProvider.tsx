import React, { useContext, createContext, useMemo, useState, ReactNode } from "react";
// If you already have an API, import it here and use inside fetchRemotePipelines()
// import { getProjectPipelines } from "../api/pipeline"; // <-- example
import { Node, Edge } from "@xyflow/react";
import { dbPipelineToGraph } from "../utils/dbPipelineToGraph";
import { getPipelines, getValidatedPipeline } from "../api/pipeline";

// Basic types
export type PipelineStatus = "draft" | "validated" | "built" | "executing" | "configured" | "terminated";
export type PipelineSource = "local" | "remote";


export interface PipelineGraph {
  nodes: Node[];
  edges: Edge[];
}

export interface Pipeline {
  id: string;
  name: string;
  projectName: string;
  status: PipelineStatus;
  source: PipelineSource;
  updatedAt: string;
  graph?: PipelineGraph;
}


interface PipelineContextType {
  pipelines: Pipeline[];                                 // merged list (remote + local)
  loading: boolean;
  refreshPipelines: (projectName: string) => Promise<void>;

  // Local-only draft helpers
  createDraft: (projectName: string, name?: string) => Pipeline;
  saveDraft: (pipeline: Pipeline) => void;
  deleteDraft: (projectName: string, id: string) => void;

  // (Later) validate via backend
  // validatePipeline: (projectName: string, id: string) => Promise<void>;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

interface PipelineProviderProps {
  children: ReactNode;
}

// ---------- Local Storage helpers ----------
const LS_PREFIX = "pipelines";
const lsKey = (projectName: string) => `${LS_PREFIX}:${projectName}`;

function readLocal(projectName: string): Pipeline[] {
  try {
    const raw = localStorage.getItem(lsKey(projectName));
    if (!raw) return [];
    const data = JSON.parse(raw) as Pipeline[];
    // Ensure minimal shape
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocal(projectName: string, items: Pipeline[]) {
  localStorage.setItem(lsKey(projectName), JSON.stringify(items));
}

// ---------- Remote fetch (stub to replace) ----------
async function fetchRemotePipelines(projectName: string): Promise<Pipeline[]> {
  const safeOrgDomainName = localStorage.getItem("domain") || "";
  const response = await getPipelines(safeOrgDomainName, projectName);
  const list = response.data;

  // list looks like: [{ pipelineName, pipelinePhase, projectName, ... }, ...]
  // console.log("Fetched remote pipelines:", list);
  const detailedPipelines: Pipeline[] = await Promise.all(
    list.map(async (p): Promise<Pipeline> => {
      if (p.pipelinePhase === "VALIDATED" || p.pipelinePhase === "BUILT" || p.pipelinePhase === "EXECUTING" || p.pipelinePhase === "TERMINATED") {
        const detailRes = await getValidatedPipeline(safeOrgDomainName, p.pipelineName);
        const detail = detailRes.data;
        const graph = dbPipelineToGraph(detail);
        console.log("Fetched and converted pipeline:", p.pipelineName, graph);

        return {
          id: `${projectName}:${p.pipelineName}`,
          name: p.pipelineName,
          projectName: p.projectName,
          status: p.pipelinePhase.toLowerCase() as PipelineStatus,
          source: "remote",
          updatedAt: new Date().toISOString(),
          graph,
        };
      } else {
        return {
          id: crypto.randomUUID(),
          name: p.pipelineName,
          projectName: p.projectName,
          status: "draft",
          source: "local",
          updatedAt: new Date().toISOString(),
          graph: { nodes: [], edges: [] },
        };
      }
    })
  );


  return detailedPipelines;
}


// ---------- Provider ----------
const PipelineProvider: React.FC<PipelineProviderProps> = ({ children }) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(false);

  // Merge local + remote (remote wins on id collisions)
  function mergePipelines(remote: Pipeline[], local: Pipeline[]) {
    const byId = new Map<string, Pipeline>();
    for (const p of local) byId.set(p.id, p);
    for (const p of remote) byId.set(p.id, p); // remote overrides local if same id
    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  const refreshPipelines = async (projectName: string) => {
    setLoading(true);
    try {
      const [remote, local] = await Promise.all([
        fetchRemotePipelines(projectName),
        Promise.resolve(readLocal(projectName)),
      ]);
      setPipelines(mergePipelines(remote, local));
    } finally {
      setLoading(false);
    }
  };

  // Local-only operations
  const createDraft = (projectName: string, name = "Untitled pipeline"): Pipeline => {
    const draft: Pipeline = {
      id: crypto.randomUUID(),
      name,
      projectName,
      status: "draft",
      source: "local",
      updatedAt: new Date().toISOString(),
      graph: { nodes: [], edges: [] },
    };
    const curr = readLocal(projectName);
    writeLocal(projectName, [draft, ...curr]);
    // update merged state (keep any remote already loaded)
    setPipelines((prev) => mergePipelines(prev.filter(p => p.source === "remote"), [draft, ...prev.filter(p => p.source === "local")]));
    return draft;
  };

  const saveDraft = (pipeline: Pipeline) => {
    if (pipeline.source !== "local") return; // only local drafts are saved this way
    const curr = readLocal(pipeline.projectName);
    const updated = [pipeline, ...curr.filter((p) => p.id !== pipeline.id)];
    writeLocal(pipeline.projectName, updated);
    setPipelines((prev) => {
      const withoutThis = prev.filter((p) => p.id !== pipeline.id);
      return mergePipelines(
        withoutThis.filter(p => p.source === "remote"),
        [pipeline, ...withoutThis.filter(p => p.source === "local")]
      );
    });
  };

  const deleteDraft = (projectName: string, id: string) => {
    const curr = readLocal(projectName);
    const updated = curr.filter((p) => p.id !== id);
    writeLocal(projectName, updated);
    setPipelines((prev) => prev.filter((p) => !(p.source === "local" && p.id === id)));
  };

  const value = useMemo<PipelineContextType>(() => ({
    pipelines,
    loading,
    refreshPipelines,
    createDraft,
    saveDraft,
    deleteDraft,
    // validatePipeline: async (projectName: string, id: string) => { ... }
  }), [pipelines, loading]);

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
};

export default PipelineProvider;

export const usePipeline = (): PipelineContextType => {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used within PipelineProvider");
  return ctx;
};
