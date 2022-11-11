import { registerPlugin } from '@capacitor/core';

import type { DocumentNormalizerPlugin } from './definitions';

const DocumentNormalizer = registerPlugin<DocumentNormalizerPlugin>('DocumentNormalizer', {
  web: () => import('./web').then(m => new m.DocumentNormalizerWeb()),
});

export * from './definitions';
export * from './utils';
export { DocumentNormalizer };
