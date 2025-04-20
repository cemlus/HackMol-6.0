import dotenv from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

// Initialize the model
const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_APIKEY, // Store this securely in your .env
});

// Zod schema for IPC charges output (temporarily removed .min(1) for debugging)
const ipcChargesSchema = z.object({
  charges: z
    .array(z.string())
    .describe("Array of applicable IPC sections in format: 'Section 376 - Rape'")
});

// Prompt template
export const ipcPrompt = ChatPromptTemplate.fromTemplate(
  `You are an expert legal assistant trained in Indian Penal Code (IPC).

Your task is to read the following complaint and return all applicable IPC sections. Respond ONLY with an array of strings, each in the format:

"Section <number> - <name of the section>"

Include EVERY section that might apply based on the complaint's content — even if they overlap. DO NOT leave the array empty if any crime is described.

Complaint Type: {complaintType}
Description: {description}
`
);

// Structured output model with schema
export const llmIPC = llm.withStructuredOutput(ipcChargesSchema, {
  name: "ipc_charge_predictor",
});