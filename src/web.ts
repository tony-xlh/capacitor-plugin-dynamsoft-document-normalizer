import { WebPlugin } from '@capacitor/core';

import { CoreModule, CapturedResult, Quadrilateral } from "dynamsoft-core";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { DetectedQuadResultItem, NormalizedImageResultItem } from 'dynamsoft-document-normalizer';
import { LicenseManager } from "dynamsoft-license";
import "dynamsoft-license";
import "dynamsoft-document-normalizer";
import "dynamsoft-capture-vision-router";
import type { DocumentNormalizerPlugin, NormalizedImageResult } from './definitions';

export class DocumentNormalizerWeb extends WebPlugin implements DocumentNormalizerPlugin {
  private cvr:CaptureVisionRouter | undefined;
  private engineResourcePaths: any = {
    core: "https://cdn.jsdelivr.net/npm/dynamsoft-core@3.0.30/dist/",
    license: "https://cdn.jsdelivr.net/npm/dynamsoft-license@3.0.20/dist/",
    cvr: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.30/dist/",
    ddn: "https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@2.0.20/dist/"
  };
  
  async initialize(): Promise<void> {
    try {
      CoreModule.engineResourcePaths = this.engineResourcePaths;
      await CoreModule.loadWasm(["DDN"]);
      this.cvr = await CaptureVisionRouter.createInstance();
      await this.cvr.initSettings("{\"CaptureVisionTemplates\": [{\"Name\": \"Default\"},{\"Name\": \"DetectDocumentBoundaries_Default\",\"ImageROIProcessingNameArray\": [\"roi-detect-document-boundaries\"]},{\"Name\": \"DetectAndNormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-binary\"]},{\"Name\": \"DetectAndNormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-gray\"]},{\"Name\": \"DetectAndNormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-color\"]},{\"Name\": \"NormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-binary\"]},{\"Name\": \"NormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-gray\"]},{\"Name\": \"NormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-color\"]}],\"TargetROIDefOptions\": [{\"Name\": \"roi-detect-document-boundaries\",\"TaskSettingNameArray\": [\"task-detect-document-boundaries\"]},{\"Name\": \"roi-detect-and-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-binary\"]},{\"Name\": \"roi-detect-and-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-gray\"]},{\"Name\": \"roi-detect-and-normalize-document-color\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-color\"]},{\"Name\": \"roi-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-normalize-document-binary\"]},{\"Name\": \"roi-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-normalize-document-gray\"]},{\"Name\": \"roi-normalize-document-color\",\"TaskSettingNameArray\": [\"task-normalize-document-color\"]}],\"DocumentNormalizerTaskSettingOptions\": [{\"Name\": \"task-detect-and-normalize-document-binary\",\"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-and-normalize-document-gray\",\"ColourMode\": \"ICM_GRAYSCALE\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-and-normalize-document-color\",\"ColourMode\": \"ICM_COLOUR\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-document-boundaries\",\"TerminateSetting\": {\"Section\": \"ST_DOCUMENT_DETECTION\"},\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect\"}]},{\"Name\": \"task-normalize-document-binary\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},{\"Name\": \"task-normalize-document-gray\",\"ColourMode\": \"ICM_GRAYSCALE\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},{\"Name\": \"task-normalize-document-color\",\"ColourMode\": \"ICM_COLOUR\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]}],\"ImageParameterOptions\": [{\"Name\": \"ip-detect-and-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}},{\"Name\": \"ip-detect\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0,\"ThresholdCompensation\": 7}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7},\"ScaleDownThreshold\": 512},{\"Name\": \"ip-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}}]}");
      this.cvr.maxCvsSideLength = 99999;
    } catch (error) {
      throw error;
    }
  }

  async initLicense(options: { license: string }): Promise<void> {
    try {
      let result = await LicenseManager.initLicense(options.license);
      if (result) {
        if (!result.isSuccess) {
          if (result.error) {
            throw result.error;
          }
        }
      }
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
      let templateName = options.template ?? "DetectDocumentBoundaries_Default";
      this.cvr.maxCvsSideLength = 99999;
      let result:CapturedResult = await this.cvr.capture(options.source,templateName,true);
      let results:DetectedQuadResultItem[] = [];
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
      let templateName = options.template ?? "NormalizeDocument_Binary";
      let settings = await this.cvr.getSimplifiedSettings(templateName);
      if (settings) {
        settings.roi  = options.quad;
        settings.roiMeasuredInPercentage = false;
        await this.cvr.updateSettings(templateName, settings);
      }
      this.cvr.maxCvsSideLength = 99999;
      let normalizedImagesResult:CapturedResult = await this.cvr.capture(options.source,templateName,true);
      let normalizedImageResultItem:NormalizedImageResultItem = (normalizedImagesResult.items[0] as NormalizedImageResultItem);
      let normalizedResult:NormalizedImageResult = {
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
        let templateName = options.template ?? "DetectAndNormalizeDocument_Color";
        this.cvr.maxCvsSideLength = 99999;
        let normalizedImagesResult:CapturedResult = await this.cvr.capture(options.source,templateName,true);
        let normalizedImageResultItem:NormalizedImageResultItem = (normalizedImagesResult.items[0] as NormalizedImageResultItem);
        let normalizedResult:NormalizedImageResult = {
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
  

  removeDataURLHead(dataURL:string){
    return dataURL.substring(dataURL.indexOf(",")+1,dataURL.length);
  }
}
