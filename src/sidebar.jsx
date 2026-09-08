import { useState } from "react";
import {
  LayoutDashboard, Building2, Landmark, ShieldCheck, School,
  FileBarChart2, History, Server, GitCompare, AlertTriangle,
  LogOut, PanelLeftClose, PanelLeftOpen, MoreHorizontal, Flag
} from "lucide-react";

const groups = [
  {
    label: null,
    items: [{ key: "dashboard", label: " Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Structures",
    items: [
      { key: "administration", label: "Administration", icon: Building2 },
      { key: "gdt", label: "GDT", icon: Landmark },
      { key: "customs", label: "Custom Service", icon: ShieldCheck },
      { key: "public", label: "Public Institution", icon: School },
    ],
  },
  {
    label: "Outils",
    items: [
      { key: "report", label: "Report", icon: FileBarChart2 },
      { key: "comparison", label: "Comparison", icon: GitCompare },
    ],
  },
  {
    label: "Système",
    items: [
      { key: "audit", label: "Audit trail", icon: History },
      { key: "server", label: "Server usage", icon: Server },
      { key: "errors", label: "Error log", icon: AlertTriangle },
    ],
  },
];

const SECTOR_KEYS = ["administration", "gdt", "customs", "public"];
const ADMIN_ONLY_KEYS = ["audit", "server", "errors"];

export default function Sidebar({ active, onNavigate, onLogout, username, role, sectors = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const initial = (username || "U").charAt(0).toUpperCase();

  const canSee = (key) => {
    if (role === "admin") return true;
    if (ADMIN_ONLY_KEYS.includes(key)) return false;
    if (SECTOR_KEYS.includes(key)) return sectors.includes(key);
    return true; // dashboard, report, comparison — open to any logged-in user
  };

  const visibleGroups = groups
    .map((g) => ({ ...g, items: g.items.filter((item) => canSee(item.key)) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside
      className={`relative shrink-0 bg-sidebarbg border border-border rounded-2xl shadow-xl flex flex-col sticky top-3 h-[calc(100vh-1.5rem)] transition-all duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* Brand + collapse toggle */}
      <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? "justify-center px-0" : "justify-between"}`}>
        {!collapsed && (
          <div>
            <p className="font-mono text-xs tracking-[0.12em] text-gold m-0">MINFI</p>
            <p className="text-[0.7rem] text-muted mt-0.5 m-0">Reporting Platform</p>
          </div>
        )}
        {collapsed && <Flag size={18} className="text-gold" />}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`text-muted hover:text-cyan transition-colors ${collapsed ? "absolute -right-3 top-6 bg-sidebarbg border border-border rounded-full p-1" : ""}`}
          aria-label={collapsed ? "Déplier le menu" : "Réduire le menu"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-2.5 flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
        {visibleGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && !collapsed && (
              <p className="text-[0.65rem] uppercase tracking-[0.1em] text-muted px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left cursor-pointer border-l-2 transition-colors ${
                      collapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-cyan/10 text-cyan border-cyan"
                        : "text-muted border-transparent hover:text-text"
                    }`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={`border-t border-border p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5 bg-card rounded-xl p-2.5">
            <div className="w-8 h-8 rounded-full bg-navy border border-border flex items-center justify-center text-cyan text-sm font-semibold flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text text-sm font-medium truncate m-0">{username || "Utilisateur"}</p>
              <p className="text-muted text-[0.7rem] truncate m-0">Compte connecté</p>
            </div>
            <button onClick={onLogout} aria-label="Déconnexion" className="text-muted hover:text-cyan flex-shrink-0">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-navy border border-border flex items-center justify-center text-cyan text-sm font-semibold">
              {initial}
            </div>
            <button onClick={onLogout} aria-label="Déconnexion" className="text-muted hover:text-cyan">
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}