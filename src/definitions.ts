import { Quadrilateral } from "dynamsoft-core";
import { DetectedQuadResultItem } from "dynamsoft-document-normalizer";

export interface DocumentNormalizerPlugin {
  initialize(): Promise<void>;
  initLicense(options: {license: string}): Promise<void>;
  initRuntimeSettingsFromString(options: {template:string}): Promise<void>;
  /**
  * Android and iOS only support base64 string. Pass a template name to specify the template.
  */
  detect(options:{source:string | HTMLImageElement | HTMLCanvasElement,template?:string}): Promise<{results:DetectedQuadResultItem[]}>;
  /**
  * Android and iOS only method which directly reads camera frames from capacitor-plugin-dynamsoft-camera-preview.  Pass a template name to specify the template.
  */
  detectBitmap(options:{template?:string}): Promise<{results:DetectedQuadResultItem[]}>;
  /**
  * Android and iOS only support base64 string. Pass a template name to specify the template.
  */
  normalize(options:{source:string | HTMLImageElement | HTMLCanvasElement, quad:Quadrilateral, template?:string, saveToFile?:boolean, includeBase64?:boolean}): Promise<{result:NormalizedImageResult}>;
  /**
  * Android and iOS only. Pass a template name to specify the template.
  */
  normalizeFile(options:{path:string, quad:Quadrilateral, template?:string, saveToFile?:boolean, includeBase64?:boolean}): Promise<{result:NormalizedImageResult}>;
  /**
  * Web Only
  */
  setEngineResourcesPath(options:{path:string}): Promise<void>; 
}

export interface NormalizedImageResult {
  base64?: string;
  path?: string;
}