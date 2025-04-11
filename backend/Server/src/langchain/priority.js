import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

// const llm = new ChatGroq({
//   model: "llama3-70b-8192",
//   temperature: 0,
//   apiKey: "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",
// });

const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_APIKEY, // Store this securely in your .env
});

// Step 1: Strict Zod schema
const classificationSchema = z.object({
  category: z.enum([
    "Noise Complaint",
    "Traffic Violation",
    "Suspicious Activity",
    "Harassment",
    "Vandalism",
    "Domestic Dispute",
    "Theft",
    "Fraud",
    "Fire Emergency",
    "Other"
  ]),
  priority: z.enum(["low", "moderate", "high"]).describe("Urgency of the issue for police action"),
});

// Step 2: Prompt template
export const promptTemplate = ChatPromptTemplate.fromTemplate(
  `You are an FIR complaint classifier.

Given a citizen's complaint, classify it into one of the following categories:
- "Noise Complaint"
- "Traffic Violation"
- "Suspicious Activity"
- "Harassment"
- "Vandalism"
- "Domestic Dispute"
- "Theft"
- "Fraud"
- "Fire Emergency"
- "Other"

Then assign one of the following priority levels:
- "low" – for petty issues or non-emergencies.
- "moderate" – for non-violent but important complaints.
- "high" – for serious crimes or emergencies (fire, assault, etc.).

Respond only with category and priority.

Complaint:
{input}
`
);

// Step 3: Wrap LLM with output schema
export const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema, {
  name: "fir_classifier",
});