import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockDatasets, mockEvaluationRuns } from "@/mock/data";
import type { EvaluationRun, EvaluationMetrics } from "@/types";
import {
  FlaskConical,
  Plus,
  Play,
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  BarChart3,
  Target,
  Zap,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";

export function EvaluationView() {
  const [activeTab, setActiveTab] = useState<"runs" | "datasets" | "compare">("runs");

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            RAG Evaluation & Benchmarks
          </h1>
          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
            Measure retrieval recall, MRR, faithfulness, answer relevance, and system latency
          </p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-all self-start sm:self-auto">
          <Play size={14} />
          <span>New Evaluation Run</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {[
          { id: "runs", label: "Evaluation Runs" },
          { id: "datasets", label: "Ground-Truth Datasets" },
          { id: "compare", label: "Config Comparison (Radar)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.id
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "runs" && <RunsTab />}
        {activeTab === "datasets" && <DatasetsTab />}
        {activeTab === "compare" && <CompareTab />}
      </div>
    </div>
  );
}

function RunsTab() {
  const [selectedRun, setSelectedRun] = useState<EvaluationRun | null>(null);

  if (selectedRun && selectedRun.metrics) {
    return <RunDetail run={selectedRun} onBack={() => setSelectedRun(null)} />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Dataset</th>
              <th className="px-4 py-3">Target Bot</th>
              <th className="px-4 py-3">Config</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockEvaluationRuns.map((run) => (
              <tr key={run.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 font-semibold text-foreground">{run.datasetName}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{run.chatbotName}</td>
                <td className="px-4 py-3.5 font-mono text-muted-foreground">v{run.configVersion}</td>
                <td className="px-4 py-3.5">
                  <RunStatusBadge status={run.status} />
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{new Date(run.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-right">
                  {run.metrics && (
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors shadow-2xs"
                    >
                      View Report
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RunStatusBadge({ status }: { status: EvaluationRun["status"] }) {
  const config = {
    completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" },
    running: { label: "Running", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400" },
    pending: { label: "Pending", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400" },
    failed: { label: "Failed", className: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", c.className)}>
      {c.label}
    </span>
  );
}

function RunDetail({ run, onBack }: { run: EvaluationRun; onBack: () => void }) {
  const m = run.metrics!;

  const retrievalData = [
    { name: "Recall@1", value: m.recall1 },
    { name: "Recall@5", value: m.recall5 },
    { name: "Recall@10", value: m.recall10 },
    { name: "MRR", value: m.mrr },
    { name: "NDCG", value: m.ndcg },
  ];

  const generationData = [
    { name: "Faithfulness", value: m.faithfulness },
    { name: "Answer Rel.", value: m.answerRelevance },
    { name: "Context Rel.", value: m.contextRelevance },
    { name: "Citation Corr.", value: m.citationCorrectness },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-sm font-bold text-foreground">
            {run.datasetName} — {run.chatbotName} (v{run.configVersion})
          </h2>
          <p className="text-[11px] text-muted-foreground">Evaluation completed {new Date(run.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground">Faithfulness Score</span>
          <div className="text-xl font-bold text-foreground">{(m.faithfulness * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground">Recall@5</span>
          <div className="text-xl font-bold text-foreground">{(m.recall5 * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground">P50 Latency</span>
          <div className="text-xl font-bold text-foreground">{m.p50Latency}ms</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground">Estimated Run Cost</span>
          <div className="text-xl font-bold text-foreground">${m.estimatedCost.toFixed(2)}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl border border-border bg-card shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-foreground">Retrieval Quality Metrics</h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retrievalData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-foreground">Generation Accuracy Metrics</h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generationData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatasetsTab() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Dataset Name</th>
              <th className="px-4 py-3">Sample Count</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockDatasets.map((ds) => (
              <tr key={ds.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-semibold text-foreground">{ds.name}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{ds.questionCount} Q&As</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(ds.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button className="px-2 py-1 text-xs rounded border border-border hover:bg-muted transition-colors">
                    Edit Set
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareTab() {
  const completedRuns = mockEvaluationRuns.filter((r) => r.status === "completed" && r.metrics);

  const radarData = [
    { metric: "Recall@5", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.recall5])) },
    { metric: "MRR", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.mrr])) },
    { metric: "NDCG", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.ndcg])) },
    { metric: "Faithfulness", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.faithfulness])) },
    { metric: "Ans. Relevance", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.answerRelevance])) },
    { metric: "Citation Corr.", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.citationCorrectness])) },
  ];

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4 animate-fade-in">
      <div>
        <h3 className="text-sm font-bold text-foreground">Multi-Version Radar Comparison</h3>
        <p className="text-xs text-muted-foreground">Superimposed quality scores across version iterations</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e4e4e7" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            {completedRuns.map((run, i) => (
              <Radar
                key={run.id}
                name={`Config v${run.configVersion}`}
                dataKey={`v${run.configVersion}`}
                stroke={["#3b82f6", "#10b981", "#f59e0b"][i]}
                fill={["#3b82f6", "#10b981", "#f59e0b"][i]}
                fillOpacity={0.2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
