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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <BarChart3 size={18} className="text-[hsl(var(--muted-foreground))]" />
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">Analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none text-[hsl(var(--foreground))]">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <MetricCard
            icon={<Activity size={16} />}
            label="Total Requests"
            value={a.totalRequests.toLocaleString()}
            trend={a.requestsTrend}
            trendLabel="vs last period"
          />
          <MetricCard
            icon={<AlertTriangle size={16} />}
            label="Error Rate"
            value={`${a.errorRate}%`}
            trend={a.errorTrend}
            trendLabel="vs last period"
            inverseTrend
          />
          <MetricCard
            icon={<Zap size={16} />}
            label="Avg Latency"
            value={`${a.avgLatency}ms`}
            trend={a.latencyTrend}
            trendLabel="vs last period"
            inverseTrend
          />
          <MetricCard
            icon={<Database size={16} />}
            label="Cache Hit Rate"
            value={`${a.cacheHitRate}%`}
            trend={a.cacheTrend}
            trendLabel="vs last period"
          />
          <MetricCard
            icon={<DollarSign size={16} />}
            label="Estimated Cost"
            value={`$${a.estimatedCost.toFixed(2)}`}
            trend={a.costTrend}
            trendLabel="vs last period"
            inverseTrend
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests Over Time */}
          <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Request Volume</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Total requests over the last 7 days</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={a.requestsOverTime}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(220, 70%, 55%)" fill="url(#reqGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Latency Breakdown */}
          <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Latency Breakdown</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Component-level latency distribution</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={a.latencyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="embedding" stackId="a" fill="hsl(270, 60%, 55%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="retrieval" stackId="a" fill="hsl(220, 70%, 55%)" />
                <Bar dataKey="reranking" stackId="a" fill="hsl(38, 92%, 50%)" />
                <Bar dataKey="llm" stackId="a" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cache Performance */}
          <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Cache Hit Rate</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Cache performance over time</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={a.cachePerformance}>
                <defs>
                  <linearGradient id="cacheGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Hit Rate"]}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(142, 76%, 36%)" fill="url(#cacheGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Token Usage */}
          <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Token Usage</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Input vs output tokens</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={a.tokenUsage}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="input" fill="hsl(220, 70%, 55%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="output" fill="hsl(270, 60%, 55%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Error Distribution */}
          <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Error Distribution</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Errors by type</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={a.errorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="count"
                  nameKey="type"
                  paddingAngle={3}
                >
                  {a.errorDistribution.map((_, i) => (
                    <Cell
                      key={i}
                      fill={[
                        "hsl(0, 84%, 60%)",
                        "hsl(38, 92%, 50%)",
                        "hsl(220, 70%, 55%)",
                        "hsl(270, 60%, 55%)",
                        "hsl(var(--muted-foreground))",
                      ][i]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  trend,
  trendLabel,
  inverseTrend = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
  inverseTrend?: boolean;
}) {
  const isPositive = inverseTrend ? trend < 0 : trend > 0;

  return (
    <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{label}</span>
        <span className="text-[hsl(var(--muted-foreground))]">{icon}</span>
      </div>
      <div className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-1">{value}</div>
      <div className="flex items-center gap-1 text-xs">
        <span className={cn("flex items-center gap-0.5 font-medium", isPositive ? "text-emerald-600" : "text-red-500")}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </span>
        <span className="text-[hsl(var(--muted-foreground))]">{trendLabel}</span>
      </div>
    </div>
  );
}
