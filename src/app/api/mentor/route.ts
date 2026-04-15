import { NextResponse } from "next/server";

function getMentorReply(message: string) {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes("computer vision")) {
    return {
      topic: "Computer Vision",
      reply:
        "Computer Vision helps machines understand images and video. It is used for classification, detection, recognition, and visual search."
    };
  }

  if (normalized.includes("neural")) {
    return {
      topic: "Neural Network",
      reply:
        "A neural network is a layered model that transforms inputs through hidden layers and learns useful patterns for prediction."
    };
  }

  if (normalized.includes("nlp")) {
    return {
      topic: "NLP",
      reply:
        "NLP stands for Natural Language Processing. It helps machines understand text and speech for tasks like sentiment analysis, chat, and summarization."
    };
  }

  if (normalized.includes("machine learning") || normalized.includes("ml")) {
    return {
      topic: "ML",
      reply:
        "Machine learning is a branch of AI where systems learn from examples and data instead of relying only on fixed rules."
    };
  }

  return {
    topic: "AI",
    reply:
      "AI is the broader goal of building systems that can reason, predict, assist, or adapt intelligently. ML, NLP, and Computer Vision are all important parts of AI."
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };

  if (!body.message?.trim()) {
    return NextResponse.json({ success: false, message: "Message is required." }, { status: 400 });
  }

  return NextResponse.json({ success: true, ...getMentorReply(body.message) });
}
