import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  useReactFlow,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLocation, useParams } from "react-router-dom";
import { usePipeline, Pipeline } from "../../context/pipelineProvider";
import { usePE } from "../../context/processingElementsProvider";
import { useAuth } from "../../auth/authProvider";

// -------- Custom Node with conditional ports --------
function ProcessingNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 bg-white border rounded shadow relative">
      {(data.type === "OPERATOR" || data.type === "SINK") && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: 12,
            height: 12,
            background: "#fff",
            border: "2px solid #000",
            borderRadius: 0,
          }}
        />
      )}

      <div className="text-sm font-medium">{data.label}</div>

      {(data.type === "OPERATOR" || data.type === "SOURCE") && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: 12,
            height: 12,
            background: "#fff",
            border: "2px solid #000",
            borderRadius: 0,
          }}
        />
      )}
    </div>
  );
}

// -------- Canvas with React Flow logic --------
function PipelineCanvas({
  draft,
  onSelectNode,
}: {
  draft: Pipeline;
  onSelectNode: (node: Node | null) => void;
}) {
  const [nodes, setNodes] = useState<Node[]>(draft.graph?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(draft.graph?.edges || []);

  const { screenToFlowPosition } = useReactFlow();
  const { saveDraft } = usePipeline();
  const pe = usePE();

  // persist changes into localStorage via context
  useEffect(() => {
    if (draft.source === "local") {
      saveDraft({
        ...draft,
        updatedAt: new Date().toISOString(),
        graph: { nodes, edges },
      });
    }
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection | Edge) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: "straight" }, eds)
      ),
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const templateId = event.dataTransfer.getData(
        "application/reactflow"
      );
      if (!templateId) return;

      const peData = pe.processingElements?.find(
        (elem) => elem.templateId === templateId
      );
      if (!peData) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${+new Date()}`,
        type: "processing",
        position,
        data: {
          label: templateId,
          type: peData.processingElementType,
          config: {}, // 👈 store config here
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, pe.processingElements]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // 👇 handle click to select node
  const onNodeClick = (_: any, node: Node) => {
    onSelectNode(node);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeClick={onNodeClick}
      fitView
      nodeTypes={{ processing: ProcessingNode }}
      defaultEdgeOptions={{ type: "straight" }}
      deleteKeyCode={["Backspace", "Delete"]}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

// -------- Main Builder with Sidebar + Canvas --------
export default function PipelineDesign() {
  const { name } = useParams<{ name: string }>();
  const location = useLocation();
  const projectName = location.pathname.split("/")[3] || "default";
  const auth = useAuth();
  const pe = usePE();
  const { pipelines, refreshPipelines, loading } = usePipeline();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    pe.getPes();
  }, []);

  useEffect(() => {
    if (projectName) {
      refreshPipelines(projectName);
    }
  }, [projectName]);

  const draft = pipelines.find((p) => p.name === name);

  if (loading) {
    return <div className="p-6">Loading pipeline…</div>;
  }

  if (!draft) {
    return <div className="p-6">Pipeline not found</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-60 bg-[#15283c] p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-white">Processing Elements</h2>
        {pe.processingElements
          ?.filter(
            (elem) =>
              elem.ownerOrganization === auth.userData?.organizationName
          )
          .map((elem) => (
            <div
              key={elem.templateId}
              className="p-2 bg-white rounded shadow mb-2 cursor-pointer hover:bg-gray-50"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData(
                  "application/reactflow",
                  elem.templateId
                )
              }
            >
              {elem.templateId}{" "}
              <span className="text-xs text-gray-500">
                ({elem.processingElementType})
              </span>
            </div>
          ))}

        <h2 className="text-lg font-semibold mb-4 mt-6 text-white">External PEs</h2>
        {pe.processingElements
          ?.filter(
            (elem) =>
              elem.ownerOrganization !== auth.userData?.organizationName
          )
          .map((elem) => (
            <div
              key={elem.templateId}
              className="p-2 bg-white rounded shadow mb-2 cursor-pointer hover:bg-gray-50"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData(
                  "application/reactflow",
                  elem.templateId
                )
              }
            >
              {elem.templateId}{" "}
              <span className="text-xs text-gray-500">
                ({elem.processingElementType})
              </span>
            </div>
          ))}
      </aside>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlowProvider>
          <PipelineCanvas draft={draft} onSelectNode={setSelectedNode} />
        </ReactFlowProvider>
      </div>

      {/* Right Sidebar for config */}
      {selectedNode && (
        <aside className="w-60 bg-[#15283c] p-4 border-l overflow-y-auto text-white">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <p className="text-sm text-gray-600 mb-4">
            Configure node {String(selectedNode.data.label)} <br />
             {/* <strong>{selectedNode.data.label}

                
             </strong> */}
          </p>

          {/* Example config fields */}
          {/* <label className="block text-sm font-medium">Parameter A</label> */}
          {/* <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            defaultValue={selectedNode.data.config?.paramA || ""}
          />

          <label className="block text-sm font-medium">Parameter B</label>
          <input
            type="number"
            className="w-full p-2 border rounded mb-4"
            defaultValue={selectedNode.data.config?.paramB || ""}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Config
          </button> */}
        </aside>
      )}
    </div>
  );
}
