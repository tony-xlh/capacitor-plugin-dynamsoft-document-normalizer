package com.dynamsoft.capacitor.ddn;

import android.graphics.Point;

import com.dynamsoft.core.CoreException;
import com.dynamsoft.core.LicenseManager;
import com.dynamsoft.core.LicenseVerificationListener;
import com.dynamsoft.core.Quadrilateral;
import com.dynamsoft.ddn.DetectedQuadResult;
import com.dynamsoft.ddn.DocumentNormalizer;
import com.dynamsoft.ddn.DocumentNormalizerException;
import com.dynamsoft.ddn.NormalizedImageResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

@CapacitorPlugin(name = "DocumentNormalizer")
public class DocumentNormalizerPlugin extends Plugin {
    private DocumentNormalizer ddn;
    @PluginMethod
    public void initialize(PluginCall call) {
        try {
            ddn = new DocumentNormalizer();
            call.resolve();
        } catch (DocumentNormalizerException e) {
            e.printStackTrace();
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void initLicense(PluginCall call) {
        String license = call.getString("license","DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==");
        LicenseManager.initLicense(license, getContext(), new LicenseVerificationListener() {
            @Override
            public void licenseVerificationCallback(boolean isSuccess, CoreException error) {
                if(!isSuccess){
                    error.printStackTrace();
                    call.reject(error.getMessage());
                }else{
                    call.resolve();
                }
            }
        });
    }

    @PluginMethod
    public void initRuntimeSettingsFromString(PluginCall call) {
        String template = call.getString("template");
        if (ddn != null) {
            try {
                ddn.initRuntimeSettingsFromString(template);
            } catch (DocumentNormalizerException e) {
                e.printStackTrace();
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }

    @PluginMethod
    public void detect(PluginCall call) {
        String source = call.getString("source");
        source = source.replaceFirst("data:.*?;base64,","");
        if (ddn != null) {
            try {
                JSObject response = new JSObject();
                JSArray detectionResults = new JSArray();
                DetectedQuadResult[] results = ddn.detectQuad(Utils.base642Bitmap(source));
                if (results != null) {
                    for (DetectedQuadResult result:results) {
                        detectionResults.put(Utils.getMapFromDetectedQuadResult(result));
                    }
                }
                response.put("results",detectionResults);
                call.resolve(response);
            } catch (DocumentNormalizerException e) {
                e.printStackTrace();
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }

    @PluginMethod
    public void normalize(PluginCall call) {
        JSObject quad = call.getObject("quad");
        String source = call.getString("source");
        source = source.replaceFirst("data:.*?;base64,","");
        if (ddn != null) {
            try {
                Point[] points = Utils.convertPoints(quad.getJSONArray("points"));
                Quadrilateral quadrilateral = new Quadrilateral();
                quadrilateral.points = points;
                NormalizedImageResult result = ddn.normalize(Utils.base642Bitmap(source),quadrilateral);
                JSObject response = new JSObject();
                response.put("data",Utils.bitmap2Base64(result.image.toBitmap()));
            }catch (Exception e) {
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }
}
