import { WebPlugin } from '@capacitor/core';
import { DCEFrame } from 'dynamsoft-camera-enhancer';
import { DetectedQuadResult, DocumentNormalizer } from 'dynamsoft-document-normalizer';
import { Quadrilateral } from 'dynamsoft-document-normalizer/dist/types/interface/quadrilateral';

import type { DocumentNormalizerPlugin, NormalizedImageResult } from './definitions';

export class DocumentNormalizerWeb extends WebPlugin implements DocumentNormalizerPlugin {
  private normalizer:DocumentNormalizer | undefined;
  private engineResourcesPath: string = "https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@1.0.10/dist/";
  private license: string = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
  async initialize(): Promise<void> {
    try {
      DocumentNormalizer.license = this.license;
      DocumentNormalizer.engineResourcePath = this.engineResourcesPath;
      this.normalizer = await DocumentNormalizer.createInstance();
    } catch (error) {
      throw error;
    }
  }

  async initLicense(options: { license: string }): Promise<void> {
    this.license = options.license;
  }

  async setEngineResourcesPath(options: { path: string; }): Promise<void> {
    this.engineResourcesPath = options.path;
  }

  async initRuntimeSettingsFromString(options: { template: string }): Promise<void> {
    if (this.normalizer) {
      await this.normalizer.setRuntimeSettings(options.template);
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async detect(options: { source: string | DCEFrame | HTMLImageElement}): Promise<{results:DetectedQuadResult[]}> {
    if (this.normalizer) {
      let detectedQuads = await this.normalizer.detectQuad(options.source);
      return {results:detectedQuads};
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async normalize(options: { source: string | DCEFrame | HTMLImageElement, quad:Quadrilateral}): Promise<{result:NormalizedImageResult}> {
    if (this.normalizer) {
      let result = await this.normalizer.normalize(options.source,{quad:options.quad});
      let normalizedResult:NormalizedImageResult = {
        data:result.image.toCanvas().toDataURL()
      }
      return {result:normalizedResult};
    } else {
      throw new Error("DDN not initialized.");
    }
  }
}
