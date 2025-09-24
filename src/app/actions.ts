"use server";

import { generateInitialContent, type GenerateInitialContentInput } from "@/ai/flows/generate-initial-content";

export async function generateContentAction(input: GenerateInitialContentInput) {
  try {
    const result = await generateInitialContent(input);
    return { success: true, content: result.content };
  } catch (error) {
    console.error("Error generating content:", error);
    return { success: false, error: "Failed to generate content. Please try again." };
  }
}
