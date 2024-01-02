import Foundation
import Capacitor
import DynamsoftCore
import DynamsoftLicense
import DynamsoftCaptureVisionRouter
import DynamsoftDocumentNormalizer

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(DocumentNormalizerPlugin)
public class DocumentNormalizerPlugin: CAPPlugin, LicenseVerificationListener   {
    private var cvr:CaptureVisionRouter!;
    private var licenseCall:CAPPluginCall!;
    @objc func initialize(_ call: CAPPluginCall) {
        if cvr == nil {
            cvr = CaptureVisionRouter()
        }
        call.resolve()
    }
    
    func loadTemplate(){
        try? cvr.initSettings("{\"CaptureVisionTemplates\": [{\"Name\": \"Default\"},{\"Name\": \"DetectDocumentBoundaries_Default\",\"ImageROIProcessingNameArray\": [\"roi-detect-document-boundaries\"]},{\"Name\": \"DetectAndNormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-binary\"]},{\"Name\": \"DetectAndNormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-gray\"]},{\"Name\": \"DetectAndNormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-color\"]},{\"Name\": \"NormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-binary\"]},{\"Name\": \"NormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-gray\"]},{\"Name\": \"NormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-color\"]}],\"TargetROIDefOptions\": [{\"Name\": \"roi-detect-document-boundaries\",\"TaskSettingNameArray\": [\"task-detect-document-boundaries\"]},{\"Name\": \"roi-detect-and-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-binary\"]},{\"Name\": \"roi-detect-and-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-gray\"]},{\"Name\": \"roi-detect-and-normalize-document-color\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-color\"]},{\"Name\": \"roi-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-normalize-document-binary\"]},{\"Name\": \"roi-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-normalize-document-gray\"]},{\"Name\": \"roi-normalize-document-color\",\"TaskSettingNameArray\": [\"task-normalize-document-color\"]}],\"DocumentNormalizerTaskSettingOptions\": [{\"Name\": \"task-detect-and-normalize-document-binary\",\"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-and-normalize-document-gray\",\"ColourMode\": \"ICM_GRAYSCALE\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-and-normalize-document-color\",\"ColourMode\": \"ICM_COLOUR\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-document-boundaries\",\"TerminateSetting\": {\"Section\": \"ST_DOCUMENT_DETECTION\"},\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect\"}]},{\"Name\": \"task-normalize-document-binary\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},{\"Name\": \"task-normalize-document-gray\",\"ColourMode\": \"ICM_GRAYSCALE\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},{\"Name\": \"task-normalize-document-color\",\"ColourMode\": \"ICM_COLOUR\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]}],\"ImageParameterOptions\": [{\"Name\": \"ip-detect-and-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}},{\"Name\": \"ip-detect\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0,\"ThresholdCompensation\": 7}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7},\"ScaleDownThreshold\": 512},{\"Name\": \"ip-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}}]}")
    }
    
    public func onLicenseVerified(_ isSuccess: Bool, error: Error?) {
        if isSuccess {
            licenseCall.resolve()
        }else{
            licenseCall.reject(error?.localizedDescription ?? "license error")
        }
        licenseCall = nil
   }

    
    @objc func initLicense(_ call: CAPPluginCall) {
        call.keepAlive = true
        licenseCall = call
        var license = call.getString("license") ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        LicenseManager.initLicense(license, verificationDelegate: self)
    }
    
    @objc func initRuntimeSettingsFromString(_ call: CAPPluginCall) {
        let template = call.getString("template") ?? ""
        if cvr != nil {
            if template != "" {
                do {
                    try cvr.initSettings(template)
                    call.resolve()
                }catch {
                    print("Unexpected error: \(error).")
                    call.reject(error.localizedDescription)
                }
            }else{
                call.reject("Empty template")
            }
        }else{
            call.reject("DDN not initialized")
        }
    }
    
    @objc func detect(_ call: CAPPluginCall) {
        var returned_results: [Any] = []
        let template = call.getString("template") ?? "DetectDocumentBoundaries_Default"
        var capturedResult:CapturedResult
        let path = call.getString("path") ?? ""
        var base64 = call.getString("source") ?? ""
        if path != "" {
            capturedResult = cvr.captureFromFile(path, templateName: template)
        }else{
            base64 = Utils.removeDataURLHead(base64)
            let image = Utils.convertBase64ToImage(base64)
            capturedResult = cvr.captureFromImage(image!, templateName: template)
        }
        let results = capturedResult.items
        if results != nil {
            for result in results! {
                returned_results.append(Utils.wrapDetectionResult(result:result as! DetectedQuadResultItem))
            }
        }
        call.resolve(["results":returned_results])
    }
    
    @objc func detectBitmap(_ call: CAPPluginCall) {
        let template = call.getString("template") ?? "DetectDocumentBoundaries_Default"
        let interop = Interoperator()
        let image = interop.getUIImage()
        var returned_results: [Any] = []
        if image != nil {
            let capturedResult = cvr.captureFromImage(image!, templateName: template)
            let results = capturedResult.items
            if results != nil {
                for result in results! {
                    returned_results.append(Utils.wrapDetectionResult(result:result as! DetectedQuadResultItem))
                }
            }
        }
        call.resolve(["results":returned_results])
    }
    
    @objc func normalize(_ call: CAPPluginCall) {

        var ret = PluginCallResultData()
        let template = call.getString("template") ?? "NormalizeDocument_Binary"
        let saveToFile = call.getBool("saveToFile", false)
        let includeBase64 = call.getBool("includeBase64", false)
        let path = call.getString("path") ?? ""
        let quadObject = call.getObject("quad")
        
        let points = quadObject!["points"] as! [[String:NSNumber]]
        let quad = Quadrilateral.init(pointArray: Utils.convertPoints(points))
        let settings = try? cvr.getSimplifiedSettings(template)
        settings?.roi = quad
        settings?.roiMeasuredInPercentage = false
        try? cvr.updateSettings(template, settings: settings!)
        
        var capturedResult:CapturedResult
        if path != "" {
            capturedResult = cvr.captureFromFile(path, templateName: template)
        }else{
            var base64 = call.getString("source") ?? ""
            base64 = Utils.removeDataURLHead(base64)
            let image = Utils.convertBase64ToImage(base64)
            capturedResult = cvr.captureFromImage(image!, templateName: template)
        }
        let results = capturedResult.items
        if results != nil {
            if results?.count ?? 0 > 0 {
                let normalizedResult = results?[0] as! NormalizedImageResultItem
                let normalizedUIImage = try? normalizedResult.imageData?.toUIImage()
                if includeBase64 {
                    let normalizedResultAsBase64 = Utils.getBase64FromImage(normalizedUIImage!)
                    ret["base64"] = normalizedResultAsBase64
                }
                if saveToFile {
                    let url = FileManager.default.temporaryDirectory
                        .appendingPathComponent(UUID().uuidString)
                        .appendingPathExtension("jpeg")
                    try? normalizedUIImage?.jpegData(compressionQuality: 1.0)?.write(to: url)
                    ret["path"] = url.absoluteString
                }
            } else {
                call.reject("Normalization failed")
            }
        }else {
            call.reject("Normalization failed")
        }
        call.resolve(ret)
    }
    
    @objc func detectAndNormalize(_ call: CAPPluginCall) {
        var ret = PluginCallResultData()
        let template = call.getString("template") ?? "DetectAndNormalizeDocument_Color"
        let saveToFile = call.getBool("saveToFile", false)
        let includeBase64 = call.getBool("includeBase64", false)
        let path = call.getString("path") ?? ""
        
        var capturedResult:CapturedResult
        if path != "" {
            capturedResult = cvr.captureFromFile(path, templateName: template)
        }else{
            var base64 = call.getString("source") ?? ""
            base64 = Utils.removeDataURLHead(base64)
            let image = Utils.convertBase64ToImage(base64)
            capturedResult = cvr.captureFromImage(image!, templateName: template)
        }
        let results = capturedResult.items
        if results != nil {
            if results?.count ?? 0 > 0 {
                let normalizedResult = results?[0] as! NormalizedImageResultItem
                let normalizedUIImage = try? normalizedResult.imageData?.toUIImage()
                if includeBase64 {
                    let normalizedResultAsBase64 = Utils.getBase64FromImage(normalizedUIImage!)
                    ret["base64"] = normalizedResultAsBase64
                }
                if saveToFile {
                    let url = FileManager.default.temporaryDirectory
                        .appendingPathComponent(UUID().uuidString)
                        .appendingPathExtension("jpeg")
                    try? normalizedUIImage?.jpegData(compressionQuality: 1.0)?.write(to: url)
                    ret["path"] = url.absoluteString
                }
            } else {
                call.reject("Normalization failed")
            }
        }else {
            call.reject("Normalization failed")
        }
        call.resolve(ret)
    }
    
    
}
