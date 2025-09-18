/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { WebPlugin } from '@capacitor/core';
import type { CapturedResult, Quadrilateral, DetectedQuadResultItem, DeskewedImageResultItem } from "dynamsoft-capture-vision-bundle";
import {CoreModule, LicenseManager, CaptureVisionRouter } from "dynamsoft-capture-vision-bundle";

import type { DocumentNormalizerPlugin, NormalizedImageResult } from './definitions';

export class DocumentNormalizerWeb extends WebPlugin implements DocumentNormalizerPlugin {
  private cvr:CaptureVisionRouter | undefined;
  private engineResourcePaths: any = {
    rootDirectory: "https://cdn.jsdelivr.net/npm/"
  };
  
  async initialize(): Promise<void> {
    CoreModule.engineResourcePaths.rootDirectory = this.engineResourcePaths.rootDirectory;
    await CoreModule.loadWasm();
    this.cvr = await CaptureVisionRouter.createInstance();
    this.cvr.maxImageSideLength = 99999;
  }

  async initLicense(options: { license: string }): Promise<void> {
    try {
      await LicenseManager.initLicense(options.license);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setEngineResourcePaths(options: { paths: any; }): Promise<void> {
    this.engineResourcePaths = options.paths;
  }

  async initRuntimeSettingsFromString(options: { template: string }): Promise<void> {
    if (this.cvr) {
      await this.cvr.initSettings(options.template);
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async detect(options: { source: string | HTMLImageElement | HTMLCanvasElement, template?:string}): Promise<{results:DetectedQuadResultItem[]}> {
    if (this.cvr) {
      const templateName = options.template ?? "DetectDocumentBoundaries_Default";
      this.cvr.maxImageSideLength = 99999;
      const result:CapturedResult = await this.cvr.capture(options.source,templateName);
      const results:DetectedQuadResultItem[] = [];
      for (let index = 0; index < result.items.length; index++) {
        const item = (result.items[index] as DetectedQuadResultItem);
        results.push(item);
      }
      return {results:results};
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  detectFile(_options: { path: string; template?: string | undefined; }): Promise<{ results: DetectedQuadResultItem[]; }> {
    throw new Error('Method not implemented.');
  }

  detectBitmap(): Promise<{ results: DetectedQuadResultItem[]; }> {
    throw new Error('Method not implemented.');
  }

  normalizeFile(_options:{path:string, quad:Quadrilateral, template?:string, saveToFile?:boolean, includeBase64?:boolean}): Promise<{result:NormalizedImageResult}>{
    throw new Error('Method not implemented.');
  }

  async normalize(options: { source: string | HTMLImageElement | HTMLCanvasElement, quad:Quadrilateral,template?:string, saveToFile?:boolean, includeBase64?:boolean}): Promise<{result:NormalizedImageResult}> {
    if (this.cvr) {
      const templateName = options.template ?? "NormalizeDocument_Default";
      const settings = await this.cvr.getSimplifiedSettings(templateName);
      if (settings) {
        settings.roi  = options.quad;
        settings.roiMeasuredInPercentage = false;
        await this.cvr.updateSettings(templateName, settings);
      }
      this.cvr.maxImageSideLength = 99999;
      const capturedResult:CapturedResult = await this.cvr.capture(options.source,templateName);
      const normalizedImageResultItem:DeskewedImageResultItem = (capturedResult.items[0] as DeskewedImageResultItem);
      const normalizedResult:NormalizedImageResult = {
        base64:this.removeDataURLHead(normalizedImageResultItem.toCanvas().toDataURL("image/jpeg"))
      }
      return {result:normalizedResult};
    } else {
      throw new Error("DDN not initialized.");
    }
  }

  async detectAndNormalize(options: { path?: string | undefined; source?: string | HTMLImageElement | HTMLCanvasElement | undefined; template?: string | undefined; saveToFile?: boolean | undefined; includeBase64?: boolean | undefined; }): Promise<{ result: NormalizedImageResult; }> {
    if (this.cvr) {
      if (options.source) {
        const templateName = options.template ?? "DetectAndNormalizeDocument_Default";
        this.cvr.maxImageSideLength = 99999;
        const capturedResult:CapturedResult = await this.cvr.capture(options.source,templateName);
        const normalizedImageResultItem:DeskewedImageResultItem = (capturedResult.items[1] as DeskewedImageResultItem);
        const normalizedResult:NormalizedImageResult = {
          base64:this.removeDataURLHead(normalizedImageResultItem.toCanvas().toDataURL("image/jpeg"))
        }
        return {result:normalizedResult};
      }else{
        throw new Error("no source");
      }
    } else {
      throw new Error("DDN not initialized");
    }
  }
  
  removeDataURLHead(dataURL:string):string{
    return dataURL.substring(dataURL.indexOf(",")+1,dataURL.length);
  }
}
