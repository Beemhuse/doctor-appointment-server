import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();
export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'xmjwnf86',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_TOKEN || '',
  useCdn: false
});
