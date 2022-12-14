import { DCEFrame } from "dynamsoft-camera-enhancer";
import { DetectedQuadResult } from "dynamsoft-document-normalizer";
import { Quadrilateral } from "dynamsoft-document-normalizer/dist/types/interface/quadrilateral";

export interface DocumentNormalizerPlugin {
  initialize(): Promise<void>;
  initLicense(options: {license: string}): Promise<void>;
  initRuntimeSettingsFromString(options: {template:string}): Promise<void>;
  /**
  * Android and iOS only support base64 string
  */
  detect(options:{source:string | DCEFrame | HTMLImageElement | HTMLCanvasElement}): Promise<{results:DetectedQuadResult[]}>;
  /**
  * Android and iOS only support base64 string
  */
  normalize(options:{source:string | DCEFrame | HTMLImageElement | HTMLCanvasElement, quad:Quadrilateral}): Promise<{result:NormalizedImageResult}>;
  /**
  * Web Only
  */
  setEngineResourcesPath(options:{path:string}): Promise<void>; 
}

export interface NormalizedImageResult {
  data: string;
}