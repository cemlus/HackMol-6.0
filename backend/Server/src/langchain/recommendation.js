import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
// import { llm } from "./model";
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

// Zod schema for output (array of follow-up questions)
const followUpSchema = z.object({
  questions: z.array(z.string()).max(5).describe("Missing details the user should add for a complete FIR"),
});

// Prompt for missing info suggestion
export const followUpPrompt = ChatPromptTemplate.fromTemplate(
  `You are helping improve FIR complaints by identifying what's missing.

Complaint Type: {complaintType}
Description: {description}

Based on this information, generate up to 5 helpful follow-up questions the user should answer to make their complaint more complete and useful for police investigation. Be specific based on the complaint type. Only return the list of questions as an array of strings.
`
);

export const llmFollowUp = llm.withStructuredOutput(followUpSchema, {
  name: "followup_questions_generator",
});
