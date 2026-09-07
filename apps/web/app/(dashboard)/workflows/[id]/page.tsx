import { notFound } from "next/navigation";
import { WorkflowBuilder } from "@/components/workflow/workflow-builder";

export const metadata = {
  title: "Éditeur de workflow — FlowMind AI",
};

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return notFound();

  return <WorkflowBuilder workflowId={numericId} />;
}