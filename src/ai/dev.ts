import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-keywords.ts';
import '@/ai/flows/summarize-content.ts';
import '@/ai/flows/generate-initial-content.ts';