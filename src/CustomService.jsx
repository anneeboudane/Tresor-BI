import { useMemo, useState } from "react";
import { CalendarClock, CalendarDays, CalendarRange, ShieldCheck, Wallet } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS, formatFCFA } from "./theme";
import { MetricCard, PanelHeader } from "./ui";


// Demonstration data: replace with the result of your FastAPI customs endpoint.
const customsCentres = [
  { name: "Bureau des Douanes de Douala Port I", region: "Littoral", notice: 356000000, paid: 302000000, overdue: 18100000, toCollect: 35900000 },
  { name: "Bureau des Douanes de Kribi", region: "Sud", notice: 247000000, paid: 201000000, overdue: 14300000, toCollect: 31700000 },
  { name: "Bureau des Douanes de Yaoundé", region: "Centre", notice: 164000000, paid: 129000000, overdue: 9700000, toCollect: 25300000 },
  { name: "Bureau des Douanes de Garoua", region: "Nord", notice: 121000000, paid: 92000000, overdue: 7600000, toCollect: 21400000 },
];

const trend10 = [
  { day: "J-9", amount: 58 }, { day: "J-8", amount: 64 }, { day: "J-7", amount: 53 },
  { day: "J-6", amount: 69 }, { day: "J-5", amount: 75 }, { day: "J-4", amount: 68 },
  { day: "J-3", amount: 82 }, { day: "J-2", amount: 77 }, { day: "J-1", amount: 88 }, { day: "J", amount: 96 },
];

function CustomService() {
  const [period, setPeriod] = useState("Ce mois");
  const [region, setRegion] = useState("Toutes les régions");
  const [centre, setCentre] = useState("Tous les centres");
  const [receipt, setReceipt] = useState("Toutes");

  const visibleCentres = customsCentres.filter((item) =>
    (region === "Toutes les régions" || item.region === region)
    && (centre === "Tous les centres" || item.name === centre),
  );
  const totals = useMemo(() => visibleCentres.reduce((sum, item) => ({
    notice: sum.notice + item.notice,
    paid: sum.paid + item.paid,
  }), { notice: 0, paid: 0 }), [visibleCentres]);

  return (
    <>
      <div className="dash-topbar"><div><h1 className="dash-title">Custom Service</h1><p className="dash-subtitle">Administration des Douanes - données de démonstration</p></div></div>

      <div className="filter-row">
        <select className="filter-select" value={period} onChange={(e) => setPeriod(e.target.value)}><option>Ce mois</option><option>Cette année</option><option>Depuis le début</option></select>
        <select className="filter-select" value={region} onChange={(e) => setRegion(e.target.value)}><option>Toutes les régions</option><option>Littoral</option><option>Sud</option><option>Centre</option><option>Nord</option></select>
        <select className="filter-select" value={centre} onChange={(e) => setCentre(e.target.value)}><option>Tous les centres</option>{customsCentres.map((item) => <option key={item.name}>{item.name}</option>)}</select>
        <select className="filter-select" value={receipt} onChange={(e) => setReceipt(e.target.value)}><option>Toutes</option><option>Droit de douane</option><option>TVA à l'importation</option><option>Accise</option></select>
      </div>

      <div className="metric-grid">
        <MetricCard label="Total depuis le début" amount={totals.notice * 6} icon={Wallet} />
        <MetricCard label="Total année en cours" amount={totals.notice * 2} icon={CalendarRange} />
        <MetricCard label="Total du mois" amount={totals.paid} icon={CalendarDays} />
        <MetricCard label="Total du jour" amount={Math.round(totals.paid * 0.03)} icon={CalendarClock} />
      </div>

      <div className="panel" style={{ marginBottom: "1.5rem" }}>
        <PanelHeader title="Situation globale - 10 derniers jours" />
        <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] border-collapse text-sm">
      <thead>
        <tr className="bg-slate-950/30 text-xs text-muted">
          <th className="px-4 py-3 text-left font-medium">
            Centre douanier
          </th>
          <th className="px-4 py-3 text-right font-medium">
            Avis d'émission
          </th>
          <th className="px-4 py-3 text-right font-medium">
            Émissions payées
          </th>
          <th className="px-4 py-3 text-right font-medium">
            En retard
          </th>
          <th className="px-4 py-3 text-right font-medium">
            À recouvrer
          </th>
        </tr>
      </thead>

      <tbody>
        {visibleCentres.map((item) => (
          <tr
            key={item.name}
            className="border-t border-border transition-colors hover:bg-yellow-400/5"
          >
            <td className="px-4 py-4 text-text">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={15} className="text-gold" />
                {item.name}
              </span>
            </td>

            <td className="px-4 py-4 text-right text-text">
              {formatFCFA(item.notice)}
            </td>

            <td className="px-4 py-4 text-right text-green-400">
              {formatFCFA(item.paid)}
            </td>

            <td className="px-4 py-4 text-right text-red-400">
              {formatFCFA(item.overdue)}
            </td>

            <td className="px-4 py-4 text-right text-text">
              {formatFCFA(item.toCollect)}
            </td>
          </tr>
        ))}

        {!visibleCentres.length && (
          <tr>
            <td
              colSpan="5"
              className="px-4 py-8 text-center text-sm text-muted"
            >
              Aucune donnée pour ces filtres.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
   </div>