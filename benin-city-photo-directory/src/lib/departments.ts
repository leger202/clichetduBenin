export type Department = {
  slug: string;
  name: string;
  capital: string;
  region: string;
  tagline: string;
  color: string;
};

export const DEPARTMENTS: Department[] = [
  {
    slug: "alibori",
    name: "Alibori",
    capital: "Kandi",
    region: "Nord-Est",
    tagline: "Savanes, parcs et fils de coton",
    color: "#B5651D",
  },
  {
    slug: "atacora",
    name: "Atacora",
    capital: "Natitingou",
    region: "Nord-Ouest",
    tagline: "Terre des Tata Somba et des cascades",
    color: "#0A7A46",
  },
  {
    slug: "atlantique",
    name: "Atlantique",
    capital: "Allada",
    region: "Sud",
    tagline: "Ganvié, Ouidah et l'océan",
    color: "#1D6FA8",
  },
  {
    slug: "borgou",
    name: "Borgou",
    capital: "Parakou",
    region: "Nord-Est",
    tagline: "Les plaines infinies du Nord",
    color: "#C98A0C",
  },
  {
    slug: "collines",
    name: "Collines",
    capital: "Savalou",
    region: "Centre",
    tagline: "Le cœur verdoyant du pays",
    color: "#4C7A34",
  },
  {
    slug: "couffo",
    name: "Couffo",
    capital: "Aplahoué",
    region: "Sud-Ouest",
    tagline: "Traditions vodun et forêts sacrées",
    color: "#7D4A9E",
  },
  {
    slug: "donga",
    name: "Donga",
    capital: "Djougou",
    region: "Nord-Ouest",
    tagline: "Le carrefour des cultures",
    color: "#C24E2E",
  },
  {
    slug: "littoral",
    name: "Littoral",
    capital: "Cotonou",
    region: "Sud",
    tagline: "Le poumon économique du Bénin",
    color: "#D8542C",
  },
  {
    slug: "mono",
    name: "Mono",
    capital: "Lokossa",
    region: "Sud-Ouest",
    tagline: "Entre lagune, bouche du Roy et cocotiers",
    color: "#20776B",
  },
  {
    slug: "oueme",
    name: "Ouémé",
    capital: "Porto-Novo",
    region: "Sud-Est",
    tagline: "La capitale aux trois noms",
    color: "#A84A6E",
  },
  {
    slug: "plateau",
    name: "Plateau",
    capital: "Sakété",
    region: "Sud-Est",
    tagline: "Terres rouges et plantations",
    color: "#8A5A2B",
  },
  {
    slug: "zou",
    name: "Zou",
    capital: "Abomey",
    region: "Centre-Sud",
    tagline: "L'héritage du royaume du Danxomè",
    color: "#B33A2B",
  },
];

export const DEPARTMENT_MAP: Record<string, Department> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.slug, d])
);

export function isDepartment(slug: string | null | undefined): slug is string {
  return !!slug && slug in DEPARTMENT_MAP;
}

export function getDepartment(slug: string): Department | undefined {
  return DEPARTMENT_MAP[slug];
}
