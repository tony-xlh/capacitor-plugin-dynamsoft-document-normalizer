import { WebPlugin } from '@capacitor/core';
import { DCEFrame } from 'dynamsoft-camera-enhancer';
import { DetectedQuadResult, DocumentNormalizer, NormalizedImageResult } from 'dynamsoft-document-normalizer';
import { Quadrilateral } from 'dynamsoft-document-normalizer/dist/types/interface/quadrilateral';

import type { DocumentNormalizerPlugin } from './definitions';

export class DocumentNormalizerWeb extends WebPlugin implements DocumentNormalizerPlugin {
  private normalizer:DocumentNormalizer | undefined;
  async initialize(): Promise<void> {
    this.normalizer = await DocumentNormalizer.createInstance();
  }

  async initLicense(options: { license: string }): Promise<void> {
    DocumentNormalizer.license = options.license;
  }

  async setEngineResourcePath(options: { path: string; }): Promise<void> {
    DocumentNormalizer.engineResourcePath = options.path;
  }

  async initRuntimeSettingsFromString(options: { template: string }): Promise<void> {
    if (this.normalizer) {
      await this.normalizer.setRuntimeSettings(options.template);
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async detect(options: { source: string | DCEFrame }): Promise<DetectedQuadResult[]> {
    if (this.normalizer) {
      return await this.normalizer.detectQuad(options.source);
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async normalize(options: { source: string | DCEFrame, quad:Quadrilateral}): Promise<NormalizedImageResult> {
    if (this.normalizer) {
      return await this.normalizer.normalize(options.source,{quad:options.quad});
    } else {
      throw new Error("DDN not initialized.");
    }
  }
}
