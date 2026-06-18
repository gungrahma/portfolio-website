import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

interface ProjectSeed {
  title: string;
  category: string;
  img: string;
  description: string;
  technologies: string[];
  year: string;
  frequentThisMonth: boolean;
  client: string;
  liveUrl: string;
  order: number;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const projects: ProjectSeed[] = [
  {
    title: "Nexus E-Commerce",
    category: "Web Development",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description:
      "A modern digital checkout experience focusing on conversion and ease of use. Engineered with performance and brutalist aesthetics to elevate the brand's digital presence.",
    technologies: ["React", "Motion", "Tailwind CSS"],
    year: "2026",
    frequentThisMonth: true,
    client: "Independent Startups",
    liveUrl: "#",
    order: 1,
  },
  {
    title: "Fintech Dashboard",
    category: "AI Automation",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    description:
      "A comprehensive financial dashboard that visualizes complex data sets with clarity and elegance. Tailored for enterprise-level scale.",
    technologies: ["Figma", "Prototyping", "Data Vis"],
    year: "2025",
    frequentThisMonth: false,
    client: "Independent Startups",
    liveUrl: "#",
    order: 2,
  },
  {
    title: "Travel App Mobile",
    category: "Photography",
    img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop",
    description:
      "An intuitive mobile application designed to simplify travel planning. Features smooth transitions and a native feel across platforms.",
    technologies: ["React Native", "Expo", "GraphQL"],
    year: "2025",
    frequentThisMonth: false,
    client: "Independent Startups",
    liveUrl: "#",
    order: 3,
  },
  {
    title: "Agency Landing Page",
    category: "Web Development",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    description:
      "A high-impact landing page crafted for a creative agency, showcasing their portfolio through WebGL interactions and scroll-triggered animations.",
    technologies: ["Three.js", "GSAP", "WebGL"],
    year: "2024",
    frequentThisMonth: true,
    client: "Independent Startups",
    liveUrl: "#",
    order: 4,
  },
  {
    title: "Healthcare Platform",
    category: "Photography",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    description:
      "A user-centric healthcare portal focusing on accessibility and seamless patient-doctor communication.",
    technologies: ["Accessibility", "UX Research", "Wireframing"],
    year: "2024",
    frequentThisMonth: false,
    client: "Independent Startups",
    liveUrl: "#",
    order: 5,
  },
  {
    title: "Smart Home Interface",
    category: "AI Automation",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    description:
      "A centralized control panel interface for smart home devices, bridging physical hardware with simple, elegant digital controls.",
    technologies: ["IoT Design", "Figma", "Interaction Design"],
    year: "2024",
    frequentThisMonth: false,
    client: "Independent Startups",
    liveUrl: "#",
    order: 6,
  },
];

async function seed() {
  const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("serviceAccountKey.json not found in project root!");
    console.error("");
    console.error("Setup steps:");
    console.error("  1. Firebase Console -> Project Settings -> Service Accounts");
    console.error("  2. Click 'Generate new private key'");
    console.error("  3. Save the JSON file as 'serviceAccountKey.json' in project root");
    console.error("  4. Re-run: npm run seed");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf-8")
  ) as ServiceAccount;

  initializeApp({
    credential: cert(serviceAccount),
  });

  const db = getFirestore();

  console.log(`Seeding ${projects.length} projects to Firestore...`);

  const batch = db.batch();
  const seededIds: string[] = [];

  for (const project of projects) {
    const id = slugify(project.title);
    const ref = db.collection("projects").doc(id);
    batch.set(ref, project);
    seededIds.push(id);
  }

  await batch.commit();

  console.log("");
  console.log("Done! All projects seeded successfully.");
  console.log("");
  console.log("Seeded IDs (derived from titles):");
  projects.forEach((p, i) =>
    console.log(`  - ${seededIds[i]}  (order: ${p.order}, category: ${p.category})`)
  );
  console.log("");
  console.log("Next: refresh your website at /projects to see the data.");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
