import { COLORS } from "./theme";

// Each node: { name, amount, children?: [node, ...] }
// A node with no `children` (or an empty array) is a leaf — the most detailed level reached.

export const sectors = {
  administration: {
    name: "Administrations",
    amount: 184300000,
    children: [
      {
        name: "Ministère de la Santé",
        amount: 52100000,
        color: COLORS.cyan,
        children: [
          { name: "Direction des Ressources Humaines", amount: 18000000 },
          { name: "Direction des Infrastructures", amount: 20100000 },
          { name: "Direction de la Pharmacie", amount: 14000000 },
        ],
      },
      {
        name: "Ministère de l'Éducation",
        amount: 47250000,
        color: COLORS.violet,
        children: [
          { name: "Direction de l'Enseignement Secondaire", amount: 22000000 },
          { name: "Direction de l'Enseignement Primaire", amount: 15250000 },
          { name: "Direction des Examens et Concours", amount: 10000000 },
        ],
      },
      {
        name: "Ministère des Transports",
        amount: 33900000,
        color: COLORS.gold,
        children: [
          { name: "Direction des Transports Terrestres", amount: 18900000 },
          { name: "Direction de l'Aviation Civile", amount: 15000000 },
        ],
      },
      {
        name: "Ministère de l'Agriculture",
        amount: 28500000,
        color: COLORS.green,
        children: [
          { name: "Direction du Développement Rural", amount: 16500000 },
          { name: "Direction des Productions", amount: 12000000 },
        ],
      },
      {
        name: "Ministère de la Défense",
        amount: 22550000,
        color: COLORS.pink,
        children: [
          { name: "Direction des Affaires Financières", amount: 22550000 },
        ],
      },
      { name: "Ministère du Commerce", amount: 14200000, color: "#64748b" },
      { name: "Ministère des Travaux Publics", amount: 11800000, color: "#64748b" },
      { name: "Ministère de la Justice", amount: 9100000, color: "#64748b" },
    ],
  },

  GDT: {
    name: "GDT (Général des Impôts)",
    amount: 142750000,
    children: [
      {
        name: "Centre des impôts — Yaoundé I",
        amount: 41200000,
        children: [
          { name: "Guichet Entreprises", amount: 24000000 },
          { name: "Guichet Particuliers", amount: 17200000 },
        ],
      },
      {
        name: "Centre des impôts — Douala II",
        amount: 38900000,
        children: [
          { name: "Guichet Entreprises", amount: 21000000 },
          { name: "Guichet Particuliers", amount: 17900000 },
        ],
      },
      { name: "Centre des impôts — Bafoussam", amount: 24650000 },
      { name: "Centre des impôts — Garoua", amount: 19800000 },
      { name: "Centre des impôts — Bamenda", amount: 18200000 },
    ],
  },

  customs: {
    name: "Custom Service",
    amount: 98600000,
    children: [
      {
        name: "Douala Port",
        amount: 41300000,
        children: [
          { name: "Poste Import", amount: 26300000 },
          { name: "Poste Export", amount: 15000000 },
        ],
      },
      {
        name: "Aéroport de Yaoundé-Nsimalen",
        amount: 22750000,
        children: [
          { name: "Poste Fret", amount: 12750000 },
          { name: "Poste Voyageurs", amount: 10000000 },
        ],
      },
      { name: "Poste frontière — Kousséri", amount: 16900000 },
      { name: "Poste frontière — Ekok", amount: 10450000 },
      { name: "Poste frontière — Kyé-Ossi", amount: 7200000 },
    ],
  },

  public: {
    name: "Public Institutions",
    amount: 56900000,
    children: [
      {
        name: "Université de Yaoundé I",
        amount: 15200000,
        children: [
          { name: "Faculté des Sciences", amount: 8200000 },
          { name: "Faculté de Médecine", amount: 7000000 },
        ],
      },
      { name: "CHU de Yaoundé", amount: 13800000 },
      {
        name: "Port Autonome de Douala",
        amount: 12100000,
        children: [
          { name: "Terminal à conteneurs", amount: 7100000 },
          { name: "Terminal pétrolier", amount: 5000000 },
        ],
      },
      { name: "CNPS", amount: 9600000 },
      { name: "SONARA", amount: 6200000 },
    ],
  },
};
