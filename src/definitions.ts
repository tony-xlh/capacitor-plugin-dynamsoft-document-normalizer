import { DCEFrame } from "dynamsoft-camera-enhancer";
import { DetectedQuadResult, NormalizedImageResult } from "dynamsoft-document-normalizer";
import { Quadrilateral } from "dynamsoft-document-normalizer/dist/types/interface/quadrilateral";

export interface DocumentNormalizerPlugin {
  initialize(): Promise<void>;
  initLicense(options: {license: string}): Promise<void>;
  initRuntimeSettingsFromString(options: {template:string}): Promise<void>;
  detect(options:{source:string | DCEFrame}): Promise<DetectedQuadResult[]>;
  normalize(options:{source:string | DCEFrame, quad:Quadrilateral}): Promise<NormalizedImageResult>;
  setEngineResourcePath(options:{path:string}): Promise<void>; 
}
