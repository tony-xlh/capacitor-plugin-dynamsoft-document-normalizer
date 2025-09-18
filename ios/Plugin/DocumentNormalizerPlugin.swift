import Foundation
import Capacitor
import DynamsoftCaptureVisionBundle

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
        let className = call.getString("className") ?? "CameraPreviewPlugin"
        let methodName = call.getString("methodName") ?? "getBitmap"
        let image = interop.getUIImage(className,methodName: methodName)
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
        var result = NSMutableDictionary()
        let template = call.getString("template") ?? "NormalizeDocument_Default"
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
                let normalizedResult = results?[0] as! DeskewedImageResultItem
                let normalizedUIImage = try? normalizedResult.imageData?.toUIImage()
                if includeBase64 {
                    let normalizedResultAsBase64 = Utils.getBase64FromImage(normalizedUIImage!)
                    result["base64"] = normalizedResultAsBase64
                }
                if saveToFile {
                    let url = FileManager.default.temporaryDirectory
                        .appendingPathComponent(UUID().uuidString)
                        .appendingPathExtension("jpeg")
                    try? normalizedUIImage?.jpegData(compressionQuality: 1.0)?.write(to: url)
                    result["path"] = url.path
                }
            } else {
                call.reject(capturedResult.errorMessage ?? "Normalization failed")
            }
        }else {
            call.reject(capturedResult.errorMessage ?? "Normalization failed")
        }
        ret["result"] = result
        call.resolve(ret)
    }
    
    @objc func detectAndNormalize(_ call: CAPPluginCall) {
        var ret = PluginCallResultData()
        var result = NSMutableDictionary()
        let template = call.getString("template") ?? "DetectAndNormalizeDocument_Default"
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
                let normalizedResult = results?[1] as! DeskewedImageResultItem
                let normalizedUIImage = try? normalizedResult.imageData?.toUIImage()
                if includeBase64 {
                    let normalizedResultAsBase64 = Utils.getBase64FromImage(normalizedUIImage!)
                    result["base64"] = normalizedResultAsBase64
                }
                if saveToFile {
                    let url = FileManager.default.temporaryDirectory
                        .appendingPathComponent(UUID().uuidString)
                        .appendingPathExtension("jpeg")
                    try? normalizedUIImage?.jpegData(compressionQuality: 1.0)?.write(to: url)
                    result["path"] = url.path
                }
            } else {
                call.reject(capturedResult.errorMessage ?? "Normalization failed")
            }
        }else {
            call.reject(capturedResult.errorMessage ?? "Normalization failed")
        }
        ret["result"] = result
        call.resolve(ret)
    }
    
    
}
