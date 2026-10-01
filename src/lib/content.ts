export const sources = [
  {
    id: "alphafold",
    number: "01",
    title: "200 million protein structures. Open to the world.",
    publisher: "GOOGLE DEEPMIND · ALPHAFOLD",
    year: "2022 milestone",
    url: "https://deepmind.google/science/alphafold/",
    detail:
      "The AlphaFold database expanded to over 200 million predicted protein structures in July 2022. These are computational predictions, with varying confidence, that support further research—not 200 million experimentally verified structures or new treatments.",
  },
  {
    id: "cost",
    number: "02",
    title: "The price of intelligence fell more than 280-fold.",
    publisher: "STANFORD HAI · 2025 AI INDEX",
    year: "Nov 2022–Oct 2024",
    url: "https://hai.stanford.edu/ai-index/2025-ai-index-report/research-and-development",
    detail:
      "The reported inference cost for GPT-3.5-level performance on MMLU fell from $20 to $0.07 per million tokens between November 2022 and October 2024. This compares a fixed benchmark threshold; it is not a price claim about every model or task.",
  },
  {
    id: "productivity",
    number: "03",
    title: "A 15% productivity lift in a real workplace.",
    publisher: "BRYNJOLFSSON, LI & RAYMOND · QJE",
    year: "Published May 2025",
    url: "https://doi.org/10.1093/qje/qjae044",
    detail:
      "The published Generative AI at Work study reports a 15% average increase in issues successfully resolved per hour among customer-support agents using an AI assistant. Effects differed across workers and were larger for less experienced agents. This is a study result, not a universal productivity estimate.",
  },
  {
    id: "materials",
    number: "04",
    title: "381,000 new candidates for stable materials.",
    publisher: "GOOGLE DEEPMIND · NATURE",
    year: "Published November 2023",
    url: "https://www.nature.com/articles/s41586-023-06735-9",
    detail:
      "GNoME identified approximately 381,000 new crystal structures predicted to be stable on the computed convex hull. These are computational candidates. Synthesis, experimental validation, and practical applications require further work.",
  },
] as const;

export const possibilities = [
  {
    id: "medicine",
    number: "01",
    label: "HEALTH & BIOLOGY",
    title: "More life.\nLess waiting.",
    description:
      "Give researchers better tools to understand disease, explore molecules, and find promising paths sooner.",
    signal: "FROM PROTEIN TO POSSIBILITY",
    type: "helix",
    color: "orange",
  },
  {
    id: "education",
    number: "02",
    label: "LEARNING & KNOWLEDGE",
    title: "A patient tutor.\nFor every mind.",
    description:
      "Make personalized explanation and practice more accessible. Curiosity shouldn’t depend on a postcode.",
    signal: "HUMAN CURIOSITY × MACHINE PATIENCE",
    type: "orbital",
    color: "lime",
  },
  {
    id: "creation",
    number: "03",
    label: "CREATIVITY & BUILDING",
    title: "Smaller teams.\nBigger ideas.",
    description:
      "Shrink the distance between an idea and a working prototype. Put more people in the builder’s seat.",
    signal: "IMAGINATION → EXECUTION",
    type: "blocks",
    color: "blue",
  },
  {
    id: "energy",
    number: "04",
    label: "MATERIALS & ENERGY",
    title: "New materials.\nNew horizons.",
    description:
      "Explore a wider search space for batteries, catalysts, and useful materials. Then test what works in the world.",
    signal: "DISCOVER. VALIDATE. REPEAT.",
    type: "crystal",
    color: "pink",
  },
] as const;

export function compoundScenario(rate: number, delay: number) {
  const years = 10;
  const now = Math.pow(1 + rate / 100, years);
  const paused = Math.pow(1 + rate / 100, years - delay);
  return { now, paused, gap: (1 - paused / now) * 100 };
}
