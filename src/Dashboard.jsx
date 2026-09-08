import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { sectors } from "./sectorData";
import DrillDown from "./DrillDown";

const COLORS = {
  cyan: "#22d3ee", violet: "#a855f7", border: "#1c2740",
  muted: "#7c93a8", tooltipBg: "#0c1120", text: "#e6f1f5",
  green: "#4ade80", red: "#f87171",
};

// Demo period-over-period deltas — replace with real comparisons once the
// backend exposes historical totals.
const deltas = {
  administration: 4.8,
  gdt: -2.1,
  customs: 6.3,
  public: 1.4,
};

const weekly = [
  { day: "Lun", paye: 38, attente: 20 },
  { day: "Mar", paye: 44, attente: 20 },
  { day: "Mer", paye: 33, attente: 16 },
  { day: "Jeu", paye: 49, attente: 22 },
  { day: "Ven", paye: 46, attente: 20 },
  { day: "Sam", paye: 27, attente: 12 },
  { day: "Dim", paye: 30, attente: 15 },
];

const transactions = [
  { day: "Lun", count: 62 },
  { day: "Mar", count: 58 },
  { day: "Mer", count: 91 },
  { day: "Jeu", count: 96 },
  { day: "Ven", count: 88 },
  { day: "Sam", count: 104 },
  { day: "Dim", count: 97 },
];

function formatAmount(n) {
  return n.toLocaleString("fr-FR");
}

function StatCard({ label, amount, delta, onClick }) {
  const isUp = delta >= 0;
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-5 bg-card border border-border cursor-pointer hover:border-cyan transition-colors"
    >
      <p className="text-muted text-xs mb-3">{label}</p>
      <p className="text-text text-3xl font-semibold mb-2">
        {formatAmount(amount)} <span className="text-sm font-normal text-muted">FCFA</span>
      </p>
      <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
        {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        {Math.abs(delta)}%
      </div>
      <p className="text-muted text-xs mt-2">vs mois précédent</p>
    </button>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("Ce mois");
  const [sector, setSector] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const sectorKeys = ["administration", "gdt", "customs", "public"];

  return (
    <>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <h1 className="text-text text-xl font-semibold m-0"> Dashboard</h1>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-card border border-border text-text rounded-lg px-3 py-2 text-sm"
          >
            <option>Ce mois</option>
            <option>Cette année</option>
            <option>Depuis le début</option>
          </select>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-card border border-border text-text rounded-lg px-3 py-2 text-sm"
          >
            <option>Tous</option>
            <option>Administration</option>
            <option>GDT</option>
            <option>Custom Service</option>
            <option>Public Institution</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {sectorKeys.map((key) => (
          <StatCard
            key={key}
            label={sectors[key].name}
            amount={sectors[key].amount}
            delta={deltas[key]}
            onClick={() => setSelected(key)}
          />
        ))}
      </div>

      {selected && (
        <div className="mb-6">
          <DrillDown root={sectors[selected]} onClose={() => setSelected(null)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-text font-semibold text-[0.92rem] mb-4">Recettes — payé vs en attente</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid stroke={COLORS.border} vertical={false} />
                <XAxis dataKey="day" stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={{ stroke: COLORS.border }} />
                <YAxis stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: COLORS.tooltipBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }}
                  labelStyle={{ color: COLORS.muted }}
                />
                <Legend wrapperStyle={{ fontSize: "0.75rem", color: COLORS.muted }} />
                <Bar dataKey="paye" name="Payé" stackId="a" fill={COLORS.cyan} radius={[0, 0, 0, 0]} />
                <Bar dataKey="attente" name="En attente" stackId="a" fill={COLORS.violet} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-text font-semibold text-[0.92rem] mb-4">Nombre de transactions</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              
              <supersetEmbed dashboardId="10" />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}