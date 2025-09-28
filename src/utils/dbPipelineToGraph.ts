import { Node, Edge } from "@xyflow/react";
import { applyLayout } from "./applyLayout";

interface DBPipeline {
  validatedPipeline: {
    channels: any[];
    elements: any[];
  };
}

export function dbPipelineToGraph(
  dbPipeline: DBPipeline
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!dbPipeline?.validatedPipeline) {
    console.warn("⚠️ No validatedPipeline found in DB pipeline:", dbPipeline);
    return { nodes, edges };
  }

  const { channels, elements } = dbPipeline.validatedPipeline;

  // --- Build nodes ---
  elements.forEach((pe: any, idx: number) => {
    if (!pe) {
      console.warn("⚠️ Skipping invalid element at index", idx, pe);
      return;
    }

    console.log("👉 Processing element at index", idx, pe);

    const nodeId = `${pe.templateID}_${pe.instanceNumber}`;
    const nodeType =
      pe.inputs?.length === 0
        ? "SOURCE"
        : pe.output === null
        ? "SINK"
        : "OPERATOR";

    nodes.push({
      id: nodeId,
      type: "processing",
      position: { x: 100 + idx * 200, y: 100 }, // simple layout
      data: {
        label: pe.templateID,
        type: nodeType,
        config: pe.configuration?.configuration ?? pe.configuration ?? {},
      },
    });
  });

  // --- Build edges ---
  channels.forEach((ch: any, chIdx: number) => {
    const publisher = ch.publisher;
    if (!publisher) {
      console.warn("⚠️ Missing publisher in channel", chIdx, ch);
      return;
    }

    const publisherId = `${publisher.templateID}_${publisher.instanceNumber}`;

    ch.subscribers?.forEach((sub: any, subIdx: number) => {
      console.log("🔍 Raw subscriber object:", sub);

      // your backend uses `sub.element`
      const subscriber =
        sub.element ?? sub.processingElement ?? sub["processing element"];

      if (!subscriber) {
        console.warn(
          "⚠️ Skipping invalid subscriber in channel",
          chIdx,
          "subscriber index",
          subIdx,
          sub
        );
        return;
      }

      const subscriberId = `${subscriber.templateID}_${subscriber.instanceNumber}`;

      edges.push({
        id: `${publisherId}->${subscriberId}`,
        source: publisherId,
        target: subscriberId,
        type: "straight",
      });
    });
  });

   // --- Apply layout with dagre ---
  const laidOutNodes = applyLayout(nodes, edges, "LR"); // 👈 Left-to-Right layout

  console.log("✅ Converted pipeline to graph:", {
    nodes: laidOutNodes,
    edges,
  });

  return { nodes: laidOutNodes, edges };
}
