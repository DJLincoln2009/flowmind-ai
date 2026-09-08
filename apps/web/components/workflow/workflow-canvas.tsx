"use client";

import { useCallback, useRef, type DragEvent } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Connection,
  type Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/stores/workflow-store";
import { useUiStore } from "@/stores/ui-store";
import { NODE_META, type FlowNode } from "@/lib/nodes";
import { WorkflowNode } from "./workflow-node";

export const nodeTypes = {
  trigger: WorkflowNode,
  condition: WorkflowNode,
  ai_summary: WorkflowNode,
  ai_extract: WorkflowNode,
  ai_classify: WorkflowNode,
  ocr: WorkflowNode,
  transcription: WorkflowNode,
  http_request: WorkflowNode,
  delay: WorkflowNode,
  output: WorkflowNode,
};

const IS_DATATRANSFER_PAYLOAD = /^flowmind:node:/;

function CanvasInner() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setInspectNode = useUiStore((s) => s.setInspectNode);

  const { screenToFlowPosition } = useReactFlow();
  const droppedType = useRef<string | null>(null);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const payload = event.dataTransfer.getData("application/flowmind");
      if (!IS_DATATRANSFER_PAYLOAD.test(payload)) return;

      const type = payload.replace("flowmind:node:", "") as FlowNode["type"];
      const meta = NODE_META[type];
      if (!meta) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const node: Node = {
        id: `${type}_${crypto.randomUUID().slice(0, 8)}`,
        type,
        position,
        data: { ...meta.defaultData },
      };
      addNode(node);
      droppedType.current = type;
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnectCallback = useCallback(
    (connection: Connection) => {
      const existing = edges.some(
        (e) => e.source === connection.source && e.target === connection.target
      );
      if (!existing) onConnect(connection);
    },
    [edges, onConnect]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnectCallback}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeClick={(_, node) => setInspectNode(node.id)}
      onPaneClick={() => setInspectNode(null)}
      fitView
      proOptions={{ hideAttribution: true }}
      deleteKeyCode={["Backspace", "Delete"]}
      multiSelectionKeyCode={["Meta", "Control"]}
      colorMode="dark"
      className="flowmind-canvas"
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
      <Controls position="bottom-right" showInteractive={false} />
      <MiniMap
        position="bottom-left"
        pannable
        zoomable
        className="!h-20 !w-32 rounded-lg border border-border"
        nodeColor={(n: Node) =>
          n.type === "ai_summary" || n.type === "ai_extract" || n.type === "ai_classify"
            ? "var(--color-accent)"
            : "#3A3A44"
        }
        maskColor="rgba(14, 14, 18, 0.72)"
      />
    </ReactFlow>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}