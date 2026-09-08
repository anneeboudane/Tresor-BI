import { useState } from "react";
import { Wallet, CalendarDays, CalendarRange, CalendarClock, ChevronRight } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { COLORS, formatFCFA } from "./theme";
import { sectors } from "./sectorData";
import { MetricCard, PanelHeader } from "./ui";
import DrillDown from "./DrillDown";

const ministries = sectors.administration.children;
const top5 = ministries.slice(0, 5);
const total = sectors.administration.amount;

const trend10 = [
  { day: "J-9", amount: 41 }, { day: "J-8", amount: 52 }, { day: "J-7", amount: 47 },
  { day: "J-6", amount: 63 }, { day: "J-5", amount: 58 }, { day: "J-4", amount: 71 },
  { day: "J-3", amount: 66 }, { day: "J-2", amount: 39 }, { day: "J-1", amount: 45 },
  { day: "J", amount: 60 },
];

const recentByMinistry = [
  { date: "21/07/2026", amount: 4200000, status: "En cours" },
  { date: "20/07/2026", amount: 3100000, status: "Payé" },
  { date: "19/07/2026", amount: 2750000, status: "Payé" },
  { date: "18/07/2026", amount: 1980000, status: "En cours" },
];

const mostlyPaidByMinistry = [
  { date: "17/07/2026", amount: 5400000 },
  { date: "16/07/2026", amount: 4980000 },
  { date: "15/07/2026", amount: 4720000 },
];

export default function Administration() {
  const [period, setPeriod] = useState("Ce mois");
  const [receipt, setReceipt] = useState("Toutes");
  const [circumstance, setCircumstance] = useState("Toutes");
  const [selectedMinistry, setSelectedMinistry] = useState("Ministère de la Santé");
  const [showAllMinistries, setShowAllMinistries] = useState(false);
  const [drillMinistry, setDrillMinistry] = useState(null);

  const visibleMinistries = showAllMinistries ? ministries : top5;

  return (
    <>
      <div className="dash-topbar">
        <div>
          <h1 className="dash-title">Administration</h1>
          <p className="dash-subtitle">Données de démonstration — à remplacer par les données réelles</p>
        </div>
      </div>

      <div className="filter-row">
        <select className="filter-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option>Ce mois</option>
          <option>Cette année</option>
          <option>Depuis le début</option>
        </select>
        <select className="filter-select" value={receipt} onChange={(e) => setReceipt(e.target.value)}>
          <option>Toutes</option>
          <option>Recette 1</option>
          <option>Recette 2</option>
        </select>
        <select className="filter-select" value={circumstance} onChange={(e) => setCircumstance(e.target.value)}>
          <option>Toutes</option>
          <option>Circonstance A</option>
          <option>Circonstance B</option>
        </select>
      </div>

      <div className="metric-grid">
        <MetricCard label="Total depuis le début" amount={total * 6} icon={Wallet} />
        <MetricCard label="Total année en cours" amount={total * 2} icon={CalendarRange} />
        <MetricCard label="Total du mois" amount={Math.round(total * 0.4)} icon={CalendarDays} />
        <MetricCard label="Total du jour" amount={Math.round(total * 0.03)} icon={CalendarClock} />
      </div>

      <div className="dash-grid-main" style={{ marginBottom: "1.5rem" }}>
        <div className="panel">
          <PanelHeader title="Répartition par ministère" />
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ministries}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {ministries.map((m, i) => (
                      <Cell key={i} fill={m.color || "#64748b"} stroke={COLORS.card} strokeWidth={2} />
                    ))}
                  </Pie>
                  <PieTooltip
                    contentStyle={{ background: COLORS.tooltipBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }}
                    formatter={(value) => formatFCFA(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="donut-legend">
              {ministries.slice(0, 6).map((m) => (
                <div className="donut-legend__item" key={m.name}>
                  <span className="donut-legend__swatch" style={{ background: m.color || "#64748b" }} />
                  {m.name}
                  <span className="donut-legend__pct">{Math.round((m.amount / total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <PanelHeader
            title="Top 5 ministères"
            action={
              <button className="see-all-btn" onClick={() => setShowAllMinistries((v) => !v)}>
                {showAllMinistries ? "Réduire" : "Voir tout"}
              </button>
            }
          />
          {visibleMinistries.map((m) => {
            const hasChildren = m.children && m.children.length > 0;
            return (
              <button
                key={m.name}
                className={`breakdown-row breakdown-row--btn${hasChildren ? "" : " leaf"}`}
                onClick={() => hasChildren && setDrillMinistry(m)}
                disabled={!hasChildren}
              >
                <span className="breakdown-row__name">{m.name}</span>
                <span className="breakdown-row__right">
                  <span className="breakdown-row__amount">{formatFCFA(m.amount)}</span>
                  {hasChildren && <ChevronRight size={15} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {drillMinistry && (
        <div style={{ marginBottom: "1.5rem" }}>
          <DrillDown root={drillMinistry} onClose={() => setDrillMinistry(null)} />
        </div>
      )}

      <div className="panel" style={{ marginBottom: "1.5rem" }}>
        <PanelHeader title="Situation globale — 10 derniers jours" />
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend10}>
              <defs>
                <linearGradient id="grad10" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.violet} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="day" stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={{ stroke: COLORS.border }} />
              <YAxis stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: COLORS.tooltipBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }}
                labelStyle={{ color: COLORS.muted }}
              />
              <Area type="monotone" dataKey="amount" stroke={COLORS.violet} strokeWidth={2} fill="url(#grad10)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dash-grid-main">
        <div className="panel">
          <PanelHeader
            title={`Activité récente — ${selectedMinistry}`}
            action={
              <select
                className="filter-select"
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                style={{ fontSize: "0.78rem", padding: "0.35rem 0.6rem" }}
              >
                {ministries.map((m) => (
                  <option key={m.name}>{m.name}</option>
                ))}
              </select>
            }
          />
          {recentByMinistry.map((row, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-row__top">
                <span className="activity-row__entity">{row.date}</span>
                <span
                  className="activity-row__amount"
                  style={{ color: row.status === "Payé" ? COLORS.green : COLORS.gold }}
                >
                  {formatFCFA(row.amount)}
                </span>
              </div>
              <p className="activity-row__date">{row.status}</p>
            </div>
          ))}
        </div>

        <div className="panel">
          <PanelHeader title={`Principalement payé — ${selectedMinistry}`} />
          {mostlyPaidByMinistry.map((row, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-row__top">
                <span className="activity-row__entity">{row.date}</span>
                <span className="activity-row__amount">{formatFCFA(row.amount)}</span>
              </div>
              <p className="activity-row__date">Payé</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
