import { z } from "zod";

/**
 * Types partagés FlowMind AI (client web + API).
 * Sources de vérité pour le graphe de workflow et les échanges JSON.
 */

// ---- Graphe de workflow (compatible @xyflow/react) ----

export const NodeTypeSchema = z.enum([
  "trigger",
  "condition",
  "ai_summary",
  "ai_extract",
  "ai_classify",
  "ocr",
  "transcription",
  "http_request",
  "delay",
  "output",
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: NodeTypeSchema,
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.unknown()).default({}),
});

export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;

export const WorkflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

export const WorkflowDefinitionSchema = z.object({
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

// ---- Workflow (API) ----

export const WorkflowSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(120),
  description: z.string().nullable().optional(),
  definition: WorkflowDefinitionSchema.default({ nodes: [], edges: [] }),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;

export const WorkflowCreateSchema = WorkflowSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type WorkflowCreate = z.input<typeof WorkflowCreateSchema>;

// ---- Exécutions ----

export const ExecutionStatusSchema = z.enum([
  "pending",
  "running",
  "success",
  "error",
]);

export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

export const ExecutionSchema = z.object({
  id: z.number(),
  workflow_id: z.number(),
  status: ExecutionStatusSchema,
  node_states: z.record(ExecutionStatusSchema).default({}),
  logs: z.array(z.unknown()).default([]),
  started_at: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  created_at: z.string(),
});

export type Execution = z.infer<typeof ExecutionSchema>;

// ---- Auth ----

export const AuthTokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.literal("bearer").default("bearer"),
});

export type AuthTokens = z.infer<typeof AuthTokensSchema>;