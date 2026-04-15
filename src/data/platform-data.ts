import {
  BadgeCheck,
  BrainCircuit,
  Cpu,
  Eye,
  Gamepad2,
  Layers3,
  MessageSquare,
  Network,
  Sparkles,
  Target,
  Trophy,
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
  | "first-login"
  | "first-module"
  | "xp-500"
  | "quiz-master"
  | "game-winner"
  | "beginner-finished"
  | "mentor-used";

export type ModuleDefinition = {
  id: ModuleId;
  title: string;
  level: Exclude<ModuleLevel, "All">;
  summary: string;
  description: string;
  whyItMatters: string;
  learningPoints: string[];
  example: string;
  estimatedTime: string;
  xpReward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: LucideIcon;
  concept: string;
  walkthrough: string;
  resources: {
    title: string;
    url: string;
    kind: "Video" | "Article" | "Course";
  }[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
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
    summary: "Understand where AI appears and how it differs from simple automation.",
    description:
      "Begin with what artificial intelligence means in real products, what kinds of problems it solves, and why data matters.",
    whyItMatters:
      "This module helps learners connect AI to everyday apps like recommendations, assistants, and search so the field feels practical instead of abstract.",
    learningPoints: [
      "How AI differs from simple rule-based automation",
      "Where AI appears in everyday products",
      "Why data is essential for intelligent behavior"
    ],
    example: "Recommendation systems and smart assistants",
    estimatedTime: "18 min",
    xpReward: 80,
    difficulty: "Easy",
    icon: BrainCircuit,
    concept:
      "AI is the broad goal of making systems behave intelligently. Some systems use rules, while others learn from data.",
    walkthrough:
      "A movie recommendation engine studies viewing patterns and suggests what you are likely to enjoy next.",
    resources: [
      {
        title: "YouTube: Intro to AI for beginners",
        url: "https://www.youtube.com/results?search_query=intro+to+artificial+intelligence+for+beginners",
        kind: "Video"
      },
      {
        title: "IBM: What is Artificial Intelligence?",
        url: "https://www.ibm.com/topics/artificial-intelligence",
        kind: "Article"
      }
    ],
    quiz: {
      question: "Which statement best describes AI?",
      options: [
        "A broad field for building intelligent systems",
        "A tool that only works with robots",
        "A kind of hardware chip",
        "A game engine"
      ],
      answer: "A broad field for building intelligent systems",
      explanation: "AI includes many approaches, including ML, search, planning, and rule-based systems."
    }
  },
  {
    id: "ml-basics",
    title: "ML Basics",
    level: "Beginner",
    summary: "Learn how machines discover patterns from examples and improve predictions.",
    description:
      "This module introduces datasets, features, labels, training, and why evaluation matters.",
    whyItMatters:
      "It gives learners the basic language of machine learning so later topics like classification and neural networks make sense.",
    learningPoints: [
      "What datasets, features, and labels mean",
      "How models learn from examples during training",
      "Why evaluation matters before using predictions"
    ],
    example: "Predicting student scores from study habits",
    estimatedTime: "24 min",
    xpReward: 90,
    difficulty: "Easy",
    icon: Cpu,
    concept:
      "Machine learning is an AI approach where systems learn patterns from historical examples rather than relying only on hand-written rules.",
    walkthrough:
      "If we show a model study hours and exam outcomes, it can learn relationships that help predict future scores.",
    resources: [
      {
        title: "YouTube: Machine learning basics for beginners",
        url: "https://www.youtube.com/results?search_query=machine+learning+basics+for+beginners",
        kind: "Video"
      },
      {
        title: "Google for Developers: Introduction to Machine Learning",
        url: "https://developers.google.com/machine-learning/intro-to-ml",
        kind: "Course"
      },
      {
        title: "Google for Developers: What is Machine Learning?",
        url: "https://developers.google.com/machine-learning/intro-to-ml/what-is-ml",
        kind: "Article"
      }
    ],
    quiz: {
      question: "What are labels in a supervised ML dataset?",
      options: [
        "The correct outputs the model should learn",
        "The computer memory size",
        "The names of programming files",
        "The model deployment servers"
      ],
      answer: "The correct outputs the model should learn",
      explanation: "Labels are the target values or classes connected to each example."
    }
  },
  {
    id: "classification",
    title: "Classification",
    level: "Intermediate",
    summary: "Train models to sort inputs into useful categories with confidence.",
    description:
      "Classification is one of the most visible ML tasks because it maps real inputs to labels.",
    whyItMatters:
      "Classification powers many real products such as spam filters, fraud alerts, medical screening tools, and content moderation systems.",
    learningPoints: [
      "How models assign categories to inputs",
      "The difference between binary and multi-class classification",
      "Why confidence and evaluation metrics matter"
    ],
    example: "Spam vs non-spam email detection",
    estimatedTime: "28 min",
    xpReward: 110,
    difficulty: "Medium",
    icon: Layers3,
    concept:
      "A classifier predicts which category an input belongs to by learning from labeled examples.",
    walkthrough:
      "A mail model can look at words such as 'free' or 'urgent' and predict whether a message is spam.",
    resources: [
      {
        title: "YouTube: Classification in machine learning explained",
        url: "https://www.youtube.com/results?search_query=classification+in+machine+learning+for+beginners",
        kind: "Video"
      },
      {
        title: "Google ML Crash Course: Classification",
        url: "https://developers.google.com/machine-learning/crash-course/classification",
        kind: "Course"
      }
    ],
    quiz: {
      question: "Which task is a classification problem?",
      options: [
        "Marking emails as spam or not spam",
        "Drawing a chart",
        "Formatting a document",
        "Compressing a folder"
      ],
      answer: "Marking emails as spam or not spam",
      explanation: "The model is assigning inputs to one of a fixed number of labels."
    }
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    level: "Intermediate",
    summary: "See how layered models learn richer patterns from data.",
    description:
      "Neural networks pass inputs through weighted layers that gradually learn meaningful patterns.",
    whyItMatters:
      "Neural networks sit behind modern vision, speech, recommendation, and language systems, so they are a key step toward understanding modern AI.",
    learningPoints: [
      "What input, hidden, and output layers do",
      "How networks learn patterns through weights",
      "Why neural nets work well on complex data"
    ],
    example: "Digit recognition from image pixels",
    estimatedTime: "34 min",
    xpReward: 130,
    difficulty: "Hard",
    icon: Network,
    concept:
      "A neural network is made of layers of connected units. Each layer transforms data and helps capture deeper relationships.",
    walkthrough:
      "An image classifier might learn edges first, then shapes, then full object patterns like digits or faces.",
    resources: [
      {
        title: "YouTube: Neural networks for beginners",
        url: "https://www.youtube.com/results?search_query=neural+networks+for+beginners",
        kind: "Video"
      },
      {
        title: "Google ML Crash Course: Neural networks",
        url: "https://developers.google.com/machine-learning/crash-course/neural-networks",
        kind: "Course"
      }
    ],
    quiz: {
      question: "What is a hidden layer in a neural network?",
      options: [
        "A layer between input and output that learns representations",
        "A secret file on disk",
        "A chart legend",
        "A hardware device"
      ],
      answer: "A layer between input and output that learns representations",
      explanation: "Hidden layers help the model transform inputs into useful internal features."
    }
  },
  {
    id: "nlp",
    title: "NLP",
    level: "Advanced",
    summary: "Work with text understanding, classification, and conversational intelligence.",
    description:
      "Natural Language Processing helps machines understand and generate human language.",
    whyItMatters:
      "This module connects AI to chatbots, translation, summarization, and search, which are some of the most visible user-facing applications today.",
    learningPoints: [
      "What NLP means in real products",
      "Common text tasks like sentiment analysis and summarization",
      "How machines turn language into structured patterns"
    ],
    example: "Sentiment analysis on product reviews",
    estimatedTime: "30 min",
    xpReward: 120,
    difficulty: "Medium",
    icon: Sparkles,
    concept:
      "NLP focuses on text and speech tasks such as sentiment analysis, summarization, translation, and chat.",
    walkthrough:
      "A review model might detect whether a customer comment is positive, neutral, or negative.",
    resources: [
      {
        title: "YouTube: NLP tutorial for beginners",
        url: "https://www.youtube.com/results?search_query=natural+language+processing+for+beginners",
        kind: "Video"
      },
      {
        title: "IBM: What is Natural Language Processing?",
        url: "https://www.ibm.com/topics/natural-language-processing",
        kind: "Article"
      }
    ],
    quiz: {
      question: "Which field handles language tasks such as sentiment analysis?",
      options: ["NLP", "Computer Graphics", "Networking", "Spreadsheet Modeling"],
      answer: "NLP",
      explanation: "NLP stands for Natural Language Processing and focuses on language data."
    }
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    level: "Advanced",
    summary: "Understand how visual models move from pixels to meaningful predictions.",
    description:
      "Computer Vision studies how machines interpret images and video for tasks like detection and recognition.",
    whyItMatters:
      "Computer vision powers face unlock, medical imaging support, manufacturing inspection, and autonomous driving systems.",
    learningPoints: [
      "How models read patterns from images and video",
      "The difference between recognition, detection, and classification",
      "Where computer vision appears in real products"
    ],
    example: "Classifying fruit images",
    estimatedTime: "36 min",
    xpReward: 140,
    difficulty: "Hard",
    icon: Eye,
    concept:
      "Computer Vision models learn visual patterns like edges, textures, and shapes from image data.",
    walkthrough:
      "A fruit classifier might learn color and contour patterns to separate apples, bananas, and oranges.",
    resources: [
      {
        title: "YouTube: Computer vision tutorial for beginners",
        url: "https://www.youtube.com/results?search_query=computer+vision+for+beginners",
        kind: "Video"
      },
      {
        title: "IBM: What is Computer Vision?",
        url: "https://www.ibm.com/think/topics/computer-vision",
        kind: "Article"
      }
    ],
    quiz: {
      question: "Which AI area focuses on images and video?",
      options: ["Computer Vision", "NLP", "Database Design", "Spreadsheet Logic"],
      answer: "Computer Vision",
      explanation: "Computer Vision helps machines interpret visual information."
    }
  }
];

export const beginnerModuleIds: ModuleId[] = ["intro-ai", "ml-basics"];

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "first-login",
    title: "First Login",
    description: "Logged in and started the AIMLverse journey.",
    icon: BadgeCheck
  },
  {
    id: "first-module",
    title: "First Module",
    description: "Completed your first learning module.",
    icon: Sparkles
  },
  {
    id: "xp-500",
    title: "500 XP",
    description: "Crossed 500 XP and built real momentum.",
    icon: Trophy
  },
  {
    id: "quiz-master",
    title: "Quiz 80+",
    description: "Scored 80 percent or higher in the quiz arena.",
    icon: BrainCircuit
  },
  {
    id: "game-winner",
    title: "3 Games Won",
    description: "Won at least three games across the mini-game arena.",
    icon: Gamepad2
  },
  {
    id: "beginner-finished",
    title: "All Beginner Modules",
    description: "Completed every beginner module in the track.",
    icon: Target
  },
  {
    id: "mentor-used",
    title: "AI Mentor Used",
    description: "Asked the mentor a learning question.",
    icon: MessageSquare
  }
];

export const filterTabs: ModuleLevel[] = ["All", "Beginner", "Intermediate", "Advanced"];

export const leaderboardBaseUsers = [
  { id: "priya", name: "Priya", xp: 1420 },
  { id: "arjun", name: "Arjun", xp: 1380 },
  { id: "riya", name: "Riya", xp: 1320 },
  { id: "dev", name: "Dev", xp: 1180 }
] as const;
