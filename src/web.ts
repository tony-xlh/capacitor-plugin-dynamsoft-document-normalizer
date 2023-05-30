import { WebPlugin } from '@capacitor/core';
import { DCEFrame } from 'dynamsoft-camera-enhancer';
import { DetectedQuadResult, DocumentNormalizer } from 'dynamsoft-document-normalizer';
import { Quadrilateral } from 'dynamsoft-document-normalizer/dist/types/interface/quadrilateral';

import type { DocumentNormalizerPlugin, NormalizedImageResult } from './definitions';

export class DocumentNormalizerWeb extends WebPlugin implements DocumentNormalizerPlugin {
  private normalizer:DocumentNormalizer | undefined;
  private engineResourcesPath: string = "https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@1.0.12/dist/";
  async initialize(): Promise<void> {
    try {
      this.normalizer = await DocumentNormalizer.createInstance();
    } catch (error) {
      throw error;
    }
  }

  async initLicense(options: { license: string }): Promise<void> {
    try {
      DocumentNormalizer.engineResourcePath = this.engineResourcesPath;
      DocumentNormalizer.license = options.license;
      await DocumentNormalizer.loadWasm();
    } catch (error) {
      console.log(error);
      throw error;
    }
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

  async detect(options: { source: string | DCEFrame | HTMLImageElement | HTMLCanvasElement, copy?:boolean}): Promise<{results:DetectedQuadResult[]}> {
    if (this.normalizer) {
      let makeACopy = true;
      if (options.copy) {
        makeACopy = options.copy;
      }
      let detectedQuads = await this.normalizer.detectQuad(options.source, makeACopy);
      return {results:detectedQuads};
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async normalize(options: { source: string | DCEFrame | HTMLImageElement | HTMLCanvasElement, quad:Quadrilateral}): Promise<{result:NormalizedImageResult}> {
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
