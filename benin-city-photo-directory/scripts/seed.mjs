import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { imageSize } from "image-size";

const { Client } = pg;

const COMMENTS = [
  {
    photoTitle: "La Porte du Non-Retour",
    author: "Mariam S.",
    content: "Un lieu chargé d'histoire, bouleversant à chaque visite.",
    daysAgo: 12,
  },
  {
    photoTitle: "La Porte du Non-Retour",
    author: "Jean-Claude A.",
    content:
      "On ne ressort jamais indifférent de cet endroit. Merci pour ce cadrage au soleil couchant.",
    daysAgo: 9,
  },
  {
    photoTitle: "Ganvié, la Venise de l'Afrique",
    author: "Fiacre E.",
    content: "J'y ai grandi — cette photo rend toute sa magie. Le matin, c'est encore plus beau !",
    daysAgo: 14,
  },
  {
    photoTitle: "Éléphants au crépuscule",
    author: "Awa B.",
    content: "La Pendjari est un trésor national. Quelle lumière incroyable !",
    daysAgo: 7,
  },
  {
    photoTitle: "Les couleurs de Dantokpa",
    author: "Sylvain Q.",
    content: "On sent presque les épices à travers l'écran. Bravo !",
    daysAgo: 5,
  },
  {
    photoTitle: "Matin à Grand-Popo",
    author: "Rosine A.",
    content: "Ma plage préférée du pays, toujours paisible le matin. Merci pour ce souvenir.",
    daysAgo: 3,
  },
  {
    photoTitle: "Parakou s'anime",
    author: "Ibrahim T.",
    content: "Le Nord dans toute sa splendeur ! Parakou mérite vraiment plus de clichés comme celui-ci.",
    daysAgo: 1,
  },
];

const SEED = [
  {
    file: "pendjari.jpg",
    title: "Éléphants au crépuscule",
    author: "Rodrigue Hounkpatin",
    department: "atacora",
    city: "Parc national de la Pendjari",
    description:
      "Un troupeau traverse la savane dorée à la tombée du jour — silence absolu, rompu seulement par les pas des géants.",
    likes: 214,
    daysAgo: 21,
  },
  {
    file: "ganvie.jpg",
    title: "Ganvié, la Venise de l'Afrique",
    author: "Aïcha Dossou",
    department: "atlantique",
    city: "Ganvié",
    description:
      "Vu du ciel, le village lacustre de Ganvié flotte entre ciel et eau. Les pirogues colorées dessinent des chemins sur le lac Nokoué.",
    likes: 187,
    daysAgo: 18,
  },
  {
    file: "ouidah-porte.jpg",
    title: "La Porte du Non-Retour",
    author: "Koffi Mensah",
    department: "atlantique",
    city: "Ouidah",
    description:
      "Face à l'Atlantique, ce monument garde la mémoire de la route des esclaves. Un lieu de recueillement au coucher du soleil.",
    likes: 243,
    daysAgo: 15,
  },
  {
    file: "dantokpa.jpg",
    title: "Les couleurs de Dantokpa",
    author: "Sandra Agbo",
    department: "littoral",
    city: "Cotonou",
    description:
      "Le plus grand marché d'Afrique de l'Ouest déborde de pagnes, d'épices et de vie. Chaque étal est un tableau.",
    likes: 168,
    daysAgo: 12,
  },
  {
    file: "tata-somba.jpg",
    title: "Forteresses de l'Atacora",
    author: "Moussa Adjakly",
    department: "atacora",
    city: "Natitingou",
    description:
      "Les tatas somba, maisons fortifiées en terre, défient les siècles au pied des monts Atacora.",
    likes: 156,
    daysAgo: 10,
  },
  {
    file: "abomey.jpg",
    title: "Mémoire des rois d'Abomey",
    author: "Nadège Gbénou",
    department: "zou",
    city: "Abomey",
    description:
      "Les bas-reliefs des palais royaux racontent, symbole par symbole, l'histoire du royaume Danxomè.",
    likes: 134,
    daysAgo: 8,
  },
  {
    file: "grand-popo.jpg",
    title: "Matin à Grand-Popo",
    author: "Franck Aholou",
    department: "mono",
    city: "Grand-Popo",
    description:
      "Les cocotiers se penchent sur la plage encore endormie. Les pêcheurs sont déjà partis avec la première lumière.",
    likes: 121,
    daysAgo: 6,
  },
  {
    file: "porto-novo.jpg",
    title: "La Grande Mosquée de Porto-Novo",
    author: "Yasmine Affon",
    department: "oueme",
    city: "Porto-Novo",
    description:
      "Héritage afro-brésilien de la capitale : sa façade baroque jaune et blanche veille sur les toits de la ville.",
    likes: 98,
    daysAgo: 4,
  },
  {
    file: "tanougou.jpg",
    title: "Les chutes de Tanougou",
    author: "Émilie Tossa",
    department: "atacora",
    city: "Tanguiéta",
    description:
      "Après la saison des pluies, la cascade de Tanougou gronde au milieu d'une végétation luxuriante.",
    likes: 87,
    daysAgo: 2,
  },
  {
    file: "parakou.jpg",
    title: "Parakou s'anime",
    author: "Bachirou Imorou",
    department: "borgou",
    city: "Parakou",
    description:
      "Au grand marché, les zémidjans fendent la poussière dorée du soir. Parakou, carrefour du Nord, ne dort jamais vraiment.",
    likes: 76,
    daysAgo: 1,
  },
];

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query(
    "select count(*)::int as n from photos"
  );
  if (rows[0].n > 0) {
    console.log(`Base déjà remplie (${rows[0].n} clichés) — photos ignorées.`);
  } else {

  for (const item of SEED) {
    const filePath = path.join(
      process.cwd(),
      "public/images/seed",
      item.file
    );
    const buf = fs.readFileSync(filePath);
    let width = null;
    let height = null;
    try {
      const dim = imageSize(buf);
      width = dim.width ?? null;
      height = dim.height ?? null;
    } catch {
      /* dimensions facultatives */
    }

    await client.query(
      `insert into photos
        (title, author, description, department, city, mime_type, image_data, width, height, likes, created_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now() - ($11 || ' days')::interval)`,
      [
        item.title,
        item.author,
        item.description,
        item.department,
        item.city,
        "image/jpeg",
        buf.toString("base64"),
        width,
        height,
        item.likes,
        String(item.daysAgo),
      ]
    );
    console.log("  ✓", item.title, `(${item.department})`);
  }
  console.log(`Photos : ${SEED.length} clichés insérés.`);
  }

  // ——— Commentaires de démonstration ———
  const { rows: commentRows } = await client.query(
    "select count(*)::int as n from comments"
  );
  if (commentRows[0].n > 0) {
    console.log("Commentaires déjà présents — ignorés.");
  } else {
    let inserted = 0;
    for (const c of COMMENTS) {
      const { rows: found } = await client.query(
        "select id from photos where title = $1 limit 1",
        [c.photoTitle]
      );
      if (!found[0]) continue;
      await client.query(
        `insert into comments (photo_id, author, content, created_at)
         values ($1, $2, $3, now() - ($4 || ' days')::interval)`,
        [found[0].id, c.author, c.content, String(c.daysAgo)]
      );
      inserted++;
    }
    console.log(`Commentaires : ${inserted} insérés.`);
  }

  await client.end();
  console.log("Seed terminé.");
}

main().catch((err) => {
  console.error("Erreur de seed :", err);
  process.exit(1);
});
