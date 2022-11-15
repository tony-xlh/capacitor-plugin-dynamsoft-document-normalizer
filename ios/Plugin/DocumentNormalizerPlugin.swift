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
}
