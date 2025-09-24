'use server';

/**
 * @fileOverview This flow generates initial content in Myanmar based on user inputs.
 *
 * - generateInitialContent - A function that generates the initial content.
 * - GenerateInitialContentInput - The input type for the generateInitialContent function.
 * - GenerateInitialContentOutput - The return type for the generateInitialContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialContentInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  purpose: z.string().describe('The purpose of the content (e.g., to inform, to persuade, to entertain).'),
  audience: z.string().describe('The target audience for the content.'),
  writingStyle: z.string().describe('The desired writing style (e.g., formal, informal, persuasive).'),
  wordCount: z.number().describe('The desired word count for the content.'),
  keywords: z.string().describe('Keywords to be included in the content.'),
  cta: z.string().describe('Call to action to be included in the content.'),
  negativeConstraints: z.string().describe('Things to avoid in the content.'),
});
export type GenerateInitialContentInput = z.infer<typeof GenerateInitialContentInputSchema>;

const GenerateInitialContentOutputSchema = z.object({
  content: z.string().describe('The generated content in Myanmar.'),
});
export type GenerateInitialContentOutput = z.infer<typeof GenerateInitialContentOutputSchema>;

export async function generateInitialContent(
  input: GenerateInitialContentInput
): Promise<GenerateInitialContentOutput> {
  return generateInitialContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialContentPrompt',
  input: {schema: GenerateInitialContentInputSchema},
  output: {schema: GenerateInitialContentOutputSchema},
  prompt: `You are an AI content generator specializing in Myanmar language content.
  Generate content based on the following inputs:

  Topic: {{{topic}}}
  Purpose: {{{purpose}}}
  Audience: {{{audience}}}
  Writing Style: {{{writingStyle}}}
  Word Count: {{{wordCount}}}
  Keywords: {{{keywords}}}
  Call to Action: {{{cta}}}
  Negative Constraints: {{{negativeConstraints}}}

  Ensure the content is in Myanmar language.
  Your response should only include the generated content.
  Include a short introduction and conclusion.
  Follow these instructions carefully.`,
});

const generateInitialContentFlow = ai.defineFlow(
  {
    name: 'generateInitialContentFlow',
    inputSchema: GenerateInitialContentInputSchema,
    outputSchema: GenerateInitialContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
