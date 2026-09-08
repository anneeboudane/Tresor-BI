import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Administration from "./Administration";
import GDT from "./GDT";

const API_URL = "http://127.0.0.1:8000";

const comingSoon = {
  public: "Public Institution",
  report: "Report",
  audit: "Audit trail",
  server: "Server usage",
  comparison: "Comparison",
  errors: "Error log",
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState("user");
  const [sectors, setSectors] = useState([]);

  const fetchMe = (authToken) => {
    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
        setSectors(data.sectors || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (token) fetchMe(token);
  }, [token]);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const isLoggedIn = !!token;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    const formBody = new URLSearchParams();
    formBody.append("username", username);
    formBody.append("password", password);

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Identifiant ou mot de passe invalide");
        return res.json();
      })
      .then((data) => {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", username);
        setLoggedInUser(username);
        setUsername("");
        setPassword("");
      })
      .catch((err) => setLoginError(err.message))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedInUser("");
    setRole("user");
    setSectors([]);
    setActiveNav("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-between gap-8 px-[6vw] py-16 overflow-hidden">
        <div
          className="absolute w-[420px] h-[420px] bg-cyan rounded-full blur-[90px] opacity-35 -top-20 -left-24 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute w-[380px] h-[380px] bg-violet rounded-full blur-[90px] opacity-35 -bottom-24 right-[10%] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative flex-1 max-w-[480px]">
          <span className="font-mono text-xs tracking-[0.14em] uppercase text-gold">
            République du Cameroun
          </span>
          <h1 className="font-serif font-semibold text-5xl md:text-6xl mt-2 mb-4 bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
            MINFI
          </h1>
          <p className="text-base leading-relaxed text-muted max-w-[32ch]">
            Plateforme de reporting financier — données consolidées,
            vision consolidée.
          </p>
          <div className="relative h-[140px]" aria-hidden="true">
            <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.8)] animate-drift" style={{ left: "10%", top: "20%", animationDelay: "0s" }} />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.8)] animate-drift" style={{ left: "70%", top: "10%", animationDelay: "1.2s" }} />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.8)] animate-drift" style={{ left: "40%", top: "60%", animationDelay: "2.4s" }} />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.8)] animate-drift" style={{ left: "85%", top: "70%", animationDelay: "0.6s" }} />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.8)] animate-drift" style={{ left: "20%", top: "80%", animationDelay: "1.8s" }} />
          </div>
        </div>

        <div className="relative z-10 w-[min(380px,90vw)] rounded-[22px] p-[1.5px] bg-gradient-to-br from-cyan to-violet animate-pulse-glow">
          <form
            className="bg-[rgba(12,17,30,0.9)] backdrop-blur-md rounded-[20px] px-8 py-10 flex flex-col gap-4"
            onSubmit={handleLogin}
          >
            <span className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-violet">
              Accès sécurisé
            </span>
            <h2 className="font-serif text-3xl mt-1 text-text">Bienvenue</h2>
            <p className="text-sm text-muted mb-2">Connectez-vous pour continuer</p>

            <label className="group flex items-center gap-2.5 border-b border-border pb-2 focus-within:border-cyan transition-colors">
              <svg className="w-[18px] h-[18px] text-muted group-focus-within:text-cyan flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                className="flex-1 bg-transparent border-none outline-none text-text text-[0.95rem] py-1 placeholder:text-muted"
                placeholder="Identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="group flex items-center gap-2.5 border-b border-border pb-2 focus-within:border-cyan transition-colors">
              <svg className="w-[18px] h-[18px] text-muted group-focus-within:text-cyan flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <input
                className="flex-1 bg-transparent border-none outline-none text-text text-[0.95rem] py-1 placeholder:text-muted"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {loginError && (
              <div className="border border-red-500/40 bg-red-500/10 text-red-300 text-[0.83rem] px-3 py-2 rounded-md" role="alert">
                {loginError}
              </div>
            )}

            <button
              className="mt-2 bg-transparent border border-cyan text-cyan px-4 py-3 text-[0.95rem] font-medium rounded-full cursor-pointer transition-colors hover:bg-cyan hover:text-[#06131c] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] disabled:opacity-60 disabled:cursor-default"
              type="submit"
              disabled={loading}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-navy gap-3 p-3">
      <Sidebar active={activeNav} onNavigate={setActiveNav} onLogout={handleLogout} username={loggedInUser} role={role} sectors={sectors} />
      <main className="flex-1 p-8 overflow-x-hidden">
        {activeNav === "dashboard" && <Dashboard />}
        {activeNav === "administration" && (
          role === "admin" || sectors.includes("administration") ? (
            <Administration />
          ) : (
            <div className="bg-card border border-border rounded-xl p-5 text-muted text-sm">
              Vous n'avez pas accès au secteur Administration.
            </div>
          )
        )}
        {activeNav === "gdt" && (
  role === "admin" || sectors.includes("gdt") ? (
    <GDT />
  ) : (
    <div className="bg-card border border-border rounded-xl p-5 text-muted text-sm">
      Vous n'avez pas accès au secteur GDT.
    </div>
  )
)}
{activeNav === "customs" && (
  role === "admin" || sectors.includes("customs") ? (
    <CustomService />
  ) : (
    <div className="bg-card border border-border rounded-xl p-5 text-muted text-sm">
      Vous n'avez pas accès au secteur Custom Service.
    </div>
  )
)}
        {comingSoon[activeNav] && (
          <div>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-text text-xl font-semibold m-0">{comingSoon[activeNav]}</h1>
                <p className="text-muted text-xs mt-1 m-0">Cette section n'est pas encore implémentée.</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-muted text-sm">
              À venir : {comingSoon[activeNav]}.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;