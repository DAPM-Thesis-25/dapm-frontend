import { Node, Edge } from "@xyflow/react";
import {
  DesignPipeline,
  DesignProcessingElement,
  DesignChannel,
} from "../api/pipeline"; // adjust path

export function graphToDesignPipeline(
  nodes: Node[],
  edges: Edge[],
  pipelineName: string,
  projectName: string
): DesignPipeline {
  // --- Processing elements ---
  const processingElements: DesignProcessingElement[] = nodes.map((n) => ({
    templateID: String(n.data.label),
    configuration: n.data.config || {},
  }));

  // --- Channels ---
  const channels: DesignChannel[] = [];

  edges.forEach((edge) => {
    const publisherNode = nodes.find((n) => n.id === edge.source);
    const subscriberNode = nodes.find((n) => n.id === edge.target);
    if (!publisherNode || !subscriberNode) return;

    const publisher: DesignProcessingElement = {
      templateID: String(publisherNode.data.label),
      configuration: publisherNode.data.config || {},
    };

    // Find or create channel for publisher
    let channel = channels.find(
      (ch) => ch.publisher.templateID === publisher.templateID
    );
    if (!channel) {
      channel = { publisher, subscribers: [] };
      channels.push(channel);
    }

    // Port number = number of connections for this subscriber
    const portNumber =
      channel.subscribers.filter(
        (s) => s["processing element"].templateID === subscriberNode.data.label
      ).length + 1;

    channel.subscribers.push({
      portNumber,
      "processing element": {
        templateID: String(subscriberNode.data.label),
        configuration: subscriberNode.data.config || {},
      },
    });
  });

  return {
    pipelineName,
    projectName,
    "processing elements": processingElements, // 👈 correct key
    channels,
  };
}
