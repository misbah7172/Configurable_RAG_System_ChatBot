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
  const [activeTab, setActiveTab] = useState<"datasets" | "runs" | "compare">("runs");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <FlaskConical size={18} className="text-[hsl(var(--muted-foreground))]" />
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">Evaluation</h1>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          <Play size={14} />
          <span>New Evaluation Run</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 pt-3 border-b border-[hsl(var(--border))]">
        {(["datasets", "runs", "compare"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-2 text-sm capitalize rounded-t-md transition-colors -mb-px",
              activeTab === tab
                ? "border-b-2 border-[hsl(var(--primary))] text-[hsl(var(--foreground))] font-medium"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "datasets" && <DatasetsTab />}
        {activeTab === "runs" && <RunsTab />}
        {activeTab === "compare" && <CompareTab />}
      </div>
    </div>
  );
}

function DatasetsTab() {
  return (
    <div className="p-6 animate-fade-in">
      <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Questions</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Created</th>
              <th className="text-right px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDatasets.map((ds) => (
              <tr key={ds.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors">
                <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{ds.name}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{ds.questionCount}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{new Date(ds.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button className="px-2 py-1 text-xs rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="flex items-center gap-2 mt-4 px-3 py-2 text-sm rounded-md border border-dashed border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))] w-full justify-center">
        <Plus size={14} />
        Create New Dataset
      </button>
    </div>
  );
}

function RunsTab() {
  const [selectedRun, setSelectedRun] = useState<EvaluationRun | null>(null);

  if (selectedRun && selectedRun.metrics) {
    return <RunDetail run={selectedRun} onBack={() => setSelectedRun(null)} />;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Dataset</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Chatbot</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Config</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Date</th>
              <th className="text-right px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockEvaluationRuns.map((run) => (
              <tr key={run.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors">
                <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{run.datasetName}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{run.chatbotName}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] font-mono">v{run.configVersion}</td>
                <td className="px-4 py-3"><RunStatusBadge status={run.status} /></td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{new Date(run.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  {run.metrics && (
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="px-2 py-1 text-xs rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors"
                    >
                      View Results
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
  const config: Record<string, { icon: React.ReactNode; className: string }> = {
    completed: { icon: <CheckCircle2 size={12} />, className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" },
    running: { icon: <Loader2 size={12} className="animate-spin" />, className: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400" },
    pending: { icon: <Clock size={12} />, className: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" },
    failed: { icon: <AlertCircle size={12} />, className: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", c.className)}>
      {c.icon} {status}
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
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-md hover:bg-[hsl(var(--accent))] transition-colors">
          <FlaskConical size={16} className="text-[hsl(var(--muted-foreground))]" />
        </button>
        <div>
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
            {run.datasetName} — {run.chatbotName} v{run.configVersion}
          </h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Completed {run.completedAt && new Date(run.completedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricSummaryCard icon={<Target size={16} />} label="Avg Faithfulness" value={`${(m.faithfulness * 100).toFixed(0)}%`} />
        <MetricSummaryCard icon={<Zap size={16} />} label="P50 Latency" value={`${m.p50Latency}ms`} />
        <MetricSummaryCard icon={<DollarSign size={16} />} label="Est. Cost" value={`$${m.estimatedCost.toFixed(2)}`} />
        <MetricSummaryCard icon={<BarChart3 size={16} />} label="Cache Hit Rate" value={`${(m.cacheHitRate * 100).toFixed(0)}%`} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retrieval Metrics */}
        <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Retrieval Metrics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={retrievalData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Generation Metrics */}
        <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Generation Metrics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={generationData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Latency */}
        <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Latency Distribution</h3>
          <div className="space-y-3">
            <LatencyBar label="P50" value={m.p50Latency} max={3000} color="hsl(220, 70%, 55%)" />
            <LatencyBar label="P95" value={m.p95Latency} max={3000} color="hsl(38, 92%, 50%)" />
            <LatencyBar label="P99" value={m.p99Latency} max={3000} color="hsl(0, 84%, 60%)" />
          </div>
        </div>

        {/* System Metrics */}
        <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">System Metrics</h3>
          <div className="space-y-3">
            <SystemMetricRow label="Total Tokens" value={m.totalTokens.toLocaleString()} />
            <SystemMetricRow label="Estimated Cost" value={`$${m.estimatedCost.toFixed(2)}`} />
            <SystemMetricRow label="Cache Hit Rate" value={`${(m.cacheHitRate * 100).toFixed(1)}%`} />
            <SystemMetricRow label="P50 Latency" value={`${m.p50Latency}ms`} />
            <SystemMetricRow label="P95 Latency" value={`${m.p95Latency}ms`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricSummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xl font-semibold text-[hsl(var(--foreground))]">{value}</span>
    </div>
  );
}

function LatencyBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[hsl(var(--muted-foreground))]">{label}</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{value}ms</span>
      </div>
      <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SystemMetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[hsl(var(--border))] last:border-0">
      <span className="text-sm text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className="text-sm font-medium font-mono text-[hsl(var(--foreground))]">{value}</span>
    </div>
  );
}

function CompareTab() {
  const completedRuns = mockEvaluationRuns.filter((r) => r.status === "completed" && r.metrics);

  if (completedRuns.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center animate-fade-in">
        <FlaskConical size={32} className="text-[hsl(var(--muted-foreground))] mb-3" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Need at least 2 completed evaluation runs to compare
        </p>
      </div>
    );
  }

  const radarData = [
    { metric: "Recall@5", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.recall5])) },
    { metric: "MRR", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.mrr])) },
    { metric: "NDCG", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.ndcg])) },
    { metric: "Faithfulness", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.faithfulness])) },
    { metric: "Ans. Relevance", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.answerRelevance])) },
    { metric: "Citation Corr.", ...Object.fromEntries(completedRuns.map((r) => [`v${r.configVersion}`, r.metrics!.citationCorrectness])) },
  ];

  const colors = ["hsl(220, 70%, 55%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)"];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Configuration Comparison</h2>

      {/* Radar Chart */}
      <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            {completedRuns.map((run, i) => (
              <Radar
                key={run.id}
                name={`v${run.configVersion}`}
                dataKey={`v${run.configVersion}`}
                stroke={colors[i]}
                fill={colors[i]}
                fillOpacity={0.15}
              />
            ))}
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Metric</th>
              {completedRuns.map((run) => (
                <th key={run.id} className="text-center px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">
                  v{run.configVersion}
                </th>
              ))}
              <th className="text-center px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Delta</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Recall@5", key: "recall5" as keyof EvaluationMetrics },
              { label: "MRR", key: "mrr" as keyof EvaluationMetrics },
              { label: "NDCG", key: "ndcg" as keyof EvaluationMetrics },
              { label: "Faithfulness", key: "faithfulness" as keyof EvaluationMetrics },
              { label: "Answer Relevance", key: "answerRelevance" as keyof EvaluationMetrics },
              { label: "P50 Latency", key: "p50Latency" as keyof EvaluationMetrics },
              { label: "Est. Cost", key: "estimatedCost" as keyof EvaluationMetrics },
            ].map(({ label, key }) => {
              const values = completedRuns.map((r) => r.metrics![key] as number);
              const delta = values.length >= 2 ? values[0] - values[1] : 0;
              const isLatencyOrCost = key === "p50Latency" || key === "estimatedCost";
              const isPositive = isLatencyOrCost ? delta < 0 : delta > 0;

              return (
                <tr key={key} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]">
                  <td className="px-4 py-2.5 text-[hsl(var(--foreground))]">{label}</td>
                  {values.map((v, i) => (
                    <td key={i} className="px-4 py-2.5 text-center font-mono text-[hsl(var(--foreground))]">
                      {key === "estimatedCost" ? `$${v.toFixed(2)}` : key === "p50Latency" ? `${v}ms` : (v * 100).toFixed(1) + "%"}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium",
                      isPositive ? "text-emerald-600" : "text-red-500"
                    )}>
                      {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(delta) < 1 ? (Math.abs(delta) * 100).toFixed(1) + "%" : Math.abs(delta).toFixed(0)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
