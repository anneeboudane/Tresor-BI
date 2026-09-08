import { useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Landmark,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS, formatFCFA } from "./theme";
import { MetricCard, PanelHeader } from "./ui";


const taxCentres = [
  { name: "CDI Yaoundé Centre", region: "Centre", notice: 284000000, paid: 219000000, overdue: 14600000, toCollect: 50400000 },
  { name: "CDI Douala I", region: "Littoral", notice: 231000000, paid: 181000000, overdue: 11900000, toCollect: 38100000 },
  { name: "CDI Bafoussam", region: "Ouest", notice: 146000000, paid: 111000000, overdue: 8200000, toCollect: 26800000 },
  { name: "CDI Garoua", region: "Nord", notice: 98000000, paid: 75600000, overdue: 6100000, toCollect: 16300000 },
];

const trend10 = [
  { day: "J-9", amount: 42 },
  { day: "J-8", amount: 50 },
  { day: "J-7", amount: 46 },
  { day: "J-6", amount: 62 },
  { day: "J-5", amount: 58 },
  { day: "J-4", amount: 71 },
  { day: "J-3", amount: 67 },
  { day: "J-2", amount: 79 },
  { day: "J-1", amount: 73 },
  { day: "J", amount: 91 },
];

export default function GDT() {
  const [period, setPeriod] = useState("Ce mois");
  const [region, setRegion] = useState("Toutes les régions");
  const [taxCentre, setTaxCentre] = useState("Tous les centres");
  const [receipt, setReceipt] = useState("Toutes");

  const centres = taxCentres.filter(
    (centre) =>
      (region === "Toutes les régions" || centre.region === region) &&
      (taxCentre === "Tous les centres" || centre.name === taxCentre)
  );

  const total = useMemo(
    () =>
      centres.reduce(
        (sum, centre) => ({
          notice: sum.notice + centre.notice,
          paid: sum.paid + centre.paid,
        }),
        { notice: 0, paid: 0 }
      ),
    [centres]
  );

  return (
    <>
      <div className="dash-topbar">
        <div>
          <h1 className="dash-title">GDT</h1>
          <p className="dash-subtitle">
            Direction Générale des Impôts - données de démonstration
          </p>
        </div>
      </div>

      <div className="filter-row">
        <select
          className="filter-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>Ce mois</option>
          <option>Cette année</option>
          <option>Depuis le début</option>
        </select>

        <select
          className="filter-select"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option>Toutes les régions</option>
          <option>Centre</option>
          <option>Littoral</option>
          <option>Ouest</option>
          <option>Nord</option>
        </select>

        <select
          className="filter-select"
          value={taxCentre}
          onChange={(e) => setTaxCentre(e.target.value)}
        >
          <option>Tous les centres</option>
          {taxCentres.map((centre) => (
            <option key={centre.name}>{centre.name}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={receipt}
          onChange={(e) => setReceipt(e.target.value)}
        >
          <option>Toutes</option>
          <option>Recette 1</option>
          <option>Recette 2</option>
        </select>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Total depuis le début"
          amount={total.notice * 6}
          icon={Wallet}
        />
        <MetricCard
          label="Total année en cours"
          amount={total.notice * 2}
          icon={CalendarRange}
        />
        <MetricCard
          label="Total du mois"
          amount={total.paid}
          icon={CalendarDays}
        />
        <MetricCard
          label="Total du jour"
          amount={Math.round(total.paid * 0.03)}
          icon={CalendarClock}
        />
      </div>

      <div className="panel" style={{ marginBottom: "1.5rem" }}>
        <PanelHeader title="Situation globale - 10 derniers jours" />

        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend10}>
              <defs>
                <linearGradient id="gdtTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis
                dataKey="day"
                stroke={COLORS.muted}
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: COLORS.border }}
              />
              <YAxis
                stroke={COLORS.muted}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: COLORS.tooltipBg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                }}
                formatter={(value) => [`${value} M FCFA`, "Recettes"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={COLORS.cyan}
                strokeWidth={2}
                fill="url(#gdtTrend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <PanelHeader title="Émissions et recouvrement par centre fiscal" />

        <div style={{ overflowX: "auto" }}>
          <table className="gdt-table">
            <thead>
              <tr>
                <th>Centre fiscal</th>
                <th>Avis d'émission</th>
                <th>Émissions payées</th>
                <th>En retard</th>
                <th>À recouvrer</th>
              </tr>
            </thead>

            <tbody>
              {centres.map((centre) => (
                <tr key={centre.name}>
                  <td>
                    <span className="gdt-table__centre">
                      <Landmark size={15} />
                      {centre.name}
                    </span>
                  </td>
                  <td>{formatFCFA(centre.notice)}</td>
                  <td className="gdt-table__paid">
                    {formatFCFA(centre.paid)}
                  </td>
                  <td className="gdt-table__overdue">
                    {formatFCFA(centre.overdue)}
                  </td>
                  <td>{formatFCFA(centre.toCollect)}</td>
                </tr>
              ))}

              {!centres.length && (
                <tr>
                  <td colSpan="5" className="gdt-table__empty">
                    Aucune donnée pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}