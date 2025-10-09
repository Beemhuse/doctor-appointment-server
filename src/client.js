import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.SANITY_TOKEN)
export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'xmjwnf86',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_TOKEN || '',
//   token:'skOTyG180ksbl9eAwFtDRm7BIKAp1I81Fn6obmCRVkxBHT0fP9JuomIhfe05uiDjYp6t6dx9fbd4UAiu8aGqRp4NKiOzjJ2rcBCISTYDy3TRvFXXBgwxppdo5yx6Pp6Ksr6AobQhNlFJiFgRICZfbijZTiND0pQEhOhA9va7i0vfbPbq9NLI',
  useCdn: false
});
