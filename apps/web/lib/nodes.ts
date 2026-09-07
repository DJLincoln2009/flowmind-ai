import type { Node, NodeProps, Edge } from "@xyflow/react";
import type { NodeType } from "@flowmind/shared";
import {
  Sparkles,
  FileText,
  ScanText,
  AudioLines,
  Braces,
  GitBranch,
  Timer,
  Globe,
  Zap,
  Flag,
  type LucideIcon,
} from "lucide-react";

export type FlowNodeData = Record<string, unknown> & {
  label?: string;
  description?: string;
};

export type FlowNode = Node<FlowNodeData, NodeType>;

export type FlowNodeProps = NodeProps<FlowNode>;

export type FlowEdge = Edge;

export type NodeCategory = "déclencheur" | "IA" | "données" | "logique";

export interface NodeMeta {
  type: NodeType;
  label: string;
  category: NodeCategory;
  icon: LucideIcon;
  description: string;
  defaultData: FlowNodeData;
}

export const NODE_META: Record<NodeType, NodeMeta> = {
  trigger: {
    type: "trigger",
    label: "Déclencheur",
    category: "déclencheur",
    icon: Zap,
    description: "Démarre le workflow (manuel, planifié, webhook).",
    defaultData: { label: "Déclencheur", mode: "manual" },
  },
  condition: {
    type: "condition",
    label: "Condition",
    category: "logique",
    icon: GitBranch,
    description: "Branche le flux selon une condition.",
    defaultData: { label: "Condition", expression: "" },
  },
  ai_summary: {
    type: "ai_summary",
    label: "Résumé IA",
    category: "IA",
    icon: Sparkles,
    description: "Résume un texte ou document avec l'IA.",
    defaultData: { label: "Résumé IA", prompt: "" },
  },
  ai_extract: {
    type: "ai_extract",
    label: "Extraction IA",
    category: "IA",
    icon: FileText,
    description: "Extrait des données structurées d'un texte.",
    defaultData: { label: "Extraction IA", fields: "" },
  },
  ai_classify: {
    type: "ai_classify",
    label: "Classification",
    category: "IA",
    icon: Braces,
    description: "Classe un document dans des catégories.",
    defaultData: { label: "Classification", categories: "" },
  },
  ocr: {
    type: "ocr",
    label: "OCR Image",
    category: "données",
    icon: ScanText,
    description: "Reconnaît le texte d'une image (OCR.space).",
    defaultData: { label: "OCR Image" },
  },
  transcription: {
    type: "transcription",
    label: "Transcription",
    category: "données",
    icon: AudioLines,
    description: "Transcrit un fichier audio (Groq Whisper).",
    defaultData: { label: "Transcription" },
  },
  http_request: {
    type: "http_request",
    label: "Requête HTTP",
    category: "données",
    icon: Globe,
    description: "Appelle une API externe (GET/POST/...).",
    defaultData: { label: "Requête HTTP", method: "GET", url: "" },
  },
  delay: {
    type: "delay",
    label: "Délai",
    category: "logique",
    icon: Timer,
    description: "Attend une durée définie avant de continuer.",
    defaultData: { label: "Délai", seconds: 0 },
  },
  output: {
    type: "output",
    label: "Sortie",
    category: "déclencheur",
    icon: Flag,
    description: "Termine le workflow et restitue le résultat.",
    defaultData: { label: "Sortie" },
  },
};

/** Ordre d'affichage de la palette (groupes). */
export const PALETTE_ORDER: NodeType[] = [
  "trigger",
  "ai_summary",
  "ai_extract",
  "ai_classify",
  "ocr",
  "transcription",
  "http_request",
  "condition",
  "delay",
  "output",
];

export const INITIAL_POSITION = { x: 120, y: 120 };