import Foundation
import Capacitor
import DynamsoftDocumentNormalizer

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(DocumentNormalizerPlugin)
public class DocumentNormalizerPlugin: CAPPlugin,LicenseVerificationListener   {
    private var ddn:DynamsoftDocumentNormalizer!;
    @objc func initialize(_ call: CAPPluginCall) {
        ddn = DynamsoftDocumentNormalizer()
        call.resolve()
    }
    
    @objc func initLicense(_ call: CAPPluginCall) {
        let license = call.getString("license") ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        DynamsoftLicenseManager.initLicense(license, verificationDelegate: self)
        call.resolve()
    }
    
    @objc func initRuntimeSettingsFromString(_ call: CAPPluginCall) {
        let template = call.getString("template") ?? ""
        if ddn != nil {
            if template != "" {
                do {
                    try ddn.initRuntimeSettingsFromString(template)
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
    
    public func licenseVerificationCallback(_ isSuccess: Bool, error: Error?) {
        print(isSuccess)
    }
    
    @objc func detect(_ call: CAPPluginCall) {
        var base64 = call.getString("source") ?? ""
        base64 = Utils.removeDataURLHead(base64)
        let image = Utils.convertBase64ToImage(base64)
        var returned_results: [Any] = []
        let results = try? ddn.detectQuadFromImage(image!)
        if results != nil {
            for result in results! {
                returned_results.append(Utils.wrapDetectionResult(result:result))
            }
        }
        call.resolve(["results":returned_results])
    }
    
    @objc func normalize(_ call: CAPPluginCall) {
        do {
            var base64 = call.getString("source") ?? ""
            base64 = Utils.removeDataURLHead(base64)
            let image = Utils.convertBase64ToImage(base64)
            let quad = call.getObject("quad")
            let points = quad!["points"] as! [[String:NSNumber]]
            let quadrilateral = iQuadrilateral.init()
            quadrilateral.points = Utils.convertPoints(points)
            
            let normalizedImageResult = try ddn.normalizeImage(image!, quad: quadrilateral)
            let normalizedUIImage = try? normalizedImageResult.image.toUIImage()
            let normalziedResultAsBase64 = Utils.getBase64FromImage(normalizedUIImage!)
            call.resolve(["result":["data":normalziedResultAsBase64]])
        }catch {
            print("Unexpected error: \(error).")
            call.reject(error.localizedDescription)
        }
    }
}
