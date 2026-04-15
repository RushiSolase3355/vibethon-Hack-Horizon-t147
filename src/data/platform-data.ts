import {
  BrainCircuit,
  Cpu,
  Eye,
  Layers3,
  Network,
  Sparkles,
  Target,
  type LucideIcon
} from "lucide-react";

export type ModuleLevel = "All" | "Beginner" | "Intermediate" | "Advanced";
export type ModuleId =
  | "intro-ai"
  | "ml-basics"
  | "classification"
  | "neural-networks"
  | "nlp"
  | "computer-vision";
export type BadgeId =
  | "fast-learner"
  | "data-detective"
  | "vision-explorer"
  | "neural-navigator";

export type ModuleDefinition = {
  id: ModuleId;
  title: string;
  level: Exclude<ModuleLevel, "All">;
  summary: string;
  description: string;
  example: string;
  lessons: number;
  estimatedTime: string;
  xpReward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  defaultProgress: number;
  progressStep: number;
  icon: LucideIcon;
};

export type BadgeDefinition = {
  id: BadgeId;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "intro-ai",
    title: "Intro to AI",
    level: "Beginner",
    summary: "Understand how AI fits into everyday products and decisions.",
    description:
      "Start with the core idea behind artificial intelligence, where it appears in real life, and how AI differs from rule-based software.",
    example: "Recommendation systems and smart assistants",
    lessons: 5,
    estimatedTime: "18 min",
    xpReward: 80,
    difficulty: "Easy",
    defaultProgress: 80,
    progressStep: 20,
    icon: BrainCircuit
  },
  {
    id: "ml-basics",
    title: "ML Basics",
    level: "Beginner",
    summary: "Learn how machines discover patterns from data.",
    description:
      "Explore datasets, training signals, and the loop that turns examples into useful predictions.",
    example: "Predicting student performance from study habits",
    lessons: 6,
    estimatedTime: "24 min",
    xpReward: 90,
    difficulty: "Easy",
    defaultProgress: 60,
    progressStep: 20,
    icon: Cpu
  },
  {
    id: "classification",
    title: "Classification",
    level: "Intermediate",
    summary: "Train models to sort data into labels with confidence.",
    description:
      "Build intuition for features, labels, and decision boundaries through practical classification tasks.",
    example: "Spam vs non-spam email detection",
    lessons: 7,
    estimatedTime: "28 min",
    xpReward: 110,
    difficulty: "Medium",
    defaultProgress: 40,
    progressStep: 20,
    icon: Layers3
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    level: "Intermediate",
    summary: "See how connected layers learn complex relationships.",
    description:
      "Learn neurons, activations, hidden layers, and why neural networks power modern AI systems.",
    example: "Digit recognition from image pixels",
    lessons: 8,
    estimatedTime: "34 min",
    xpReward: 130,
    difficulty: "Hard",
    defaultProgress: 20,
    progressStep: 20,
    icon: Network
  },
  {
    id: "nlp",
    title: "NLP",
    level: "Advanced",
    summary: "Work with text classification, embeddings, and chat-style tasks.",
    description:
      "Understand how machines interpret language, compare text, and generate useful responses.",
    example: "Sentiment analysis on product reviews",
    lessons: 7,
    estimatedTime: "30 min",
    xpReward: 120,
    difficulty: "Medium",
    defaultProgress: 10,
    progressStep: 15,
    icon: Sparkles
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    level: "Advanced",
    summary: "Understand image features, detection, and recognition flows.",
    description:
      "Follow how visual models move from pixels to features to object-level understanding in real products.",
    example: "Classifying fruit images in a mini game",
    lessons: 9,
    estimatedTime: "36 min",
    xpReward: 140,
    difficulty: "Hard",
    defaultProgress: 0,
    progressStep: 20,
    icon: Eye
  }
];

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "fast-learner",
    title: "Fast Learner",
    description: "Finish your first module to unlock this momentum badge.",
    icon: Sparkles
  },
  {
    id: "data-detective",
    title: "Data Detective",
    description: "Earn 500 XP to prove your pattern-spotting instincts.",
    icon: Target
  },
  {
    id: "vision-explorer",
    title: "Vision Explorer",
    description: "Complete the Computer Vision module to unlock it.",
    icon: Eye
  },
  {
    id: "neural-navigator",
    title: "Neural Navigator",
    description: "Finish Neural Networks and earn the deep learning badge.",
    icon: Network
  }
];

export const filterTabs: ModuleLevel[] = ["All", "Beginner", "Intermediate", "Advanced"];

export const leaderboardBaseEntries = [
  { rank: 1, name: "Priya", xp: 1420 },
  { rank: 2, name: "Arjun", xp: 1380 },
  { rank: 3, name: "Riya", xp: 1320 }
] as const;
