import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockAnalytics } from "@/mock/data";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Database,
  DollarSign,
  AlertTriangle,
  Activity,
  Calendar,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export function AnalyticsDashboard() {
  const a = mockAnalytics;
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            System Analytics & Metrics
          </h1>
          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
            Real-time latency breakdown, token usage, cache hit rate, and cost tracking
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-card self-start sm:self-auto shadow-2xs">
          {[
            { id: "24h", label: "24 Hours" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                timeRange === t.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards (Matching reference screenshot style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Requests</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp size={11} /> +{a.requestsTrend}%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {a.totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trending up this period · Inquiries & RAG runs
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Cache Hit Rate</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp size={11} /> +{a.cacheTrend}%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {a.cacheHitRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Exact & Semantic cache savings
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">P50 Latency</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              <Zap size={11} /> {a.avgLatency}ms
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              ${a.estimatedCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total estimated LLM & embedding cost
            </p>
          </div>
        </div>
      </div>

      {/* Large Chart Card (Matching reference UI: Total Visitors / Requests) */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm lg:text-base font-bold text-foreground">
              Total Traffic & Request Volume
            </h3>
            <p className="text-xs text-muted-foreground">
              Total processed RAG requests over the selected duration
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" /> Active Traffic
          </div>
        </div>

        <div className="h-64 lg:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={a.requestsOverTime}>
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#71717a" />
              <YAxis tick={{ fontSize: 11 }} stroke="#71717a" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#18181b"
                strokeWidth={2.5}
                fill="url(#primaryGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tab Pills Footer (Matching reference screenshot bottom tabs) */}
        <div className="flex items-center gap-2 pt-3 border-t border-border overflow-x-auto text-xs">
          {[
            { id: "overview", label: "Outline" },
            { id: "past", label: "Past Performance (3)" },
            { id: "latency", label: "Latency Breakdown" },
            { id: "tokens", label: "Token Usage" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Latency Breakdown + Token Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Latency Breakdown */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Latency Breakdown by Pipeline Stage
            </h3>
            <p className="text-xs text-muted-foreground">
              Embedding vs Retrieval vs Reranking vs Generation (ms)
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.latencyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis tick={{ fontSize: 11 }} stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="embedding" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} name="Embedding" />
                <Bar dataKey="retrieval" stackId="a" fill="#3b82f6" name="Retrieval" />
                <Bar dataKey="reranking" stackId="a" fill="#f59e0b" name="Reranking" />
                <Bar dataKey="llm" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="LLM Gen" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Usage Breakdown */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Token Consumption (Input vs Output)
            </h3>
            <p className="text-xs text-muted-foreground">
              Context tokens vs generation response tokens
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.tokenUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis tick={{ fontSize: 11 }} stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="input" fill="#18181b" radius={[4, 4, 0, 0]} name="Prompt Tokens" />
                <Bar dataKey="output" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Completion Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
