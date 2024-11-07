package com.dynamsoft.capacitor.ddn;

import android.graphics.Bitmap;
import android.graphics.Point;
import android.util.Log;

import com.dynamsoft.core.basic_structures.CapturedResult;
import com.dynamsoft.core.basic_structures.CapturedResultItem;
import com.dynamsoft.core.basic_structures.Quadrilateral;
import com.dynamsoft.cvr.CaptureVisionRouter;
import com.dynamsoft.cvr.CaptureVisionRouterException;
import com.dynamsoft.cvr.SimplifiedCaptureVisionSettings;
import com.dynamsoft.ddn.DetectedQuadResultItem;
import com.dynamsoft.ddn.NormalizedImageResultItem;
import com.dynamsoft.license.LicenseManager;
import com.dynamsoft.utility.ImageManager;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;

@CapacitorPlugin(name = "DocumentNormalizer")
public class DocumentNormalizerPlugin extends Plugin {
    private CaptureVisionRouter cvr;
    @PluginMethod
    public void initialize(PluginCall call) {
        if (cvr == null) {
            cvr = new CaptureVisionRouter(getContext());
            try {
                cvr.initSettings("{\"CaptureVisionTemplates\": [{\"Name\": \"Default\"},{\"Name\": \"DetectDocumentBoundaries_Default\",\"ImageROIProcessingNameArray\": [\"roi-detect-document-boundaries\"]},{\"Name\": \"DetectAndNormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-binary\"]},{\"Name\": \"DetectAndNormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-gray\"]},{\"Name\": \"DetectAndNormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document-color\"]},{\"Name\": \"NormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-binary\"]},{\"Name\": \"NormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-gray\"]},{\"Name\": \"NormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-color\"]}],\"TargetROIDefOptions\": [{\"Name\": \"roi-detect-document-boundaries\",\"TaskSettingNameArray\": [\"task-detect-document-boundaries\"]},{\"Name\": \"roi-detect-and-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-binary\"]},{\"Name\": \"roi-detect-and-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-gray\"]},{\"Name\": \"roi-detect-and-normalize-document-color\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document-color\"]},{\"Name\": \"roi-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-normalize-document-binary\"]},{\"Name\": \"roi-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-normalize-document-gray\"]},{\"Name\": \"roi-normalize-document-color\",\"TaskSettingNameArray\": [\"task-normalize-document-color\"]}],\"DocumentNormalizerTaskSettingOptions\": [{\"Name\": \"task-detect-and-normalize-document-binary\",\"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-and-normalize-document-gray\",\"ColourMode\": \"ICM_GRAYSCALE\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-and-normalize-document-color\",\"ColourMode\": \"ICM_COLOUR\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-document-boundaries\",\"TerminateSetting\": {\"Section\": \"ST_DOCUMENT_DETECTION\"},\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect\"}]},{\"Name\": \"task-normalize-document-binary\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},{\"Name\": \"task-normalize-document-gray\",\"ColourMode\": \"ICM_GRAYSCALE\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},{\"Name\": \"task-normalize-document-color\",\"ColourMode\": \"ICM_COLOUR\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]}],\"ImageParameterOptions\": [{\"Name\": \"ip-detect-and-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}},{\"Name\": \"ip-detect\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0,\"ThresholdCompensation\": 7}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7},\"ScaleDownThreshold\": 512},{\"Name\": \"ip-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}}]}");
            } catch (CaptureVisionRouterException e) {
                throw new RuntimeException(e);
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void initLicense(PluginCall call) {
        String license = call.getString("license","DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==");
        LicenseManager.initLicense(license, getContext(), (isSuccess, error) -> {
            if (!isSuccess) {
                Log.e("DDN", "InitLicense Error: " + error);
                call.reject(error.getMessage());
            }else{
                Log.d("DDN","license valid");
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void initRuntimeSettingsFromString(PluginCall call) {
        String template = call.getString("template");
        if (cvr != null) {
            try {
                cvr.initSettings(template);
                call.resolve();
            } catch (CaptureVisionRouterException e) {
                e.printStackTrace();
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }

    @PluginMethod
    public void detect(PluginCall call) {
        String path = call.getString("path","");
        String source = call.getString("source","");
        String templateName = call.getString("template","DetectDocumentBoundaries_Default");
        if (path.equals("")) {
            source = source.replaceFirst("data:.*?;base64,","");
        }
        if (cvr != null) {
            try {
                JSObject response = new JSObject();
                JSArray detectionResults = new JSArray();
                CapturedResult capturedResult;
                if (path.equals("")) {
                    capturedResult = cvr.capture(Utils.base642Bitmap(source),templateName);
                }else{
                    capturedResult = cvr.capture(path,templateName);
                }
                CapturedResultItem[] results = capturedResult.getItems();
                if (results != null) {
                    for (CapturedResultItem result:results) {
                        if (result instanceof DetectedQuadResultItem) {
                            detectionResults.put(Utils.getMapFromDetectedQuadResult((DetectedQuadResultItem) result));
                        }
                    }
                }
                response.put("results",detectionResults);
                call.resolve(response);
            } catch (Exception e) {
                e.printStackTrace();
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }

    @PluginMethod
    public void detectBitmap(PluginCall call) {
        if (cvr != null) {
            try {
                JSObject response = new JSObject();
                JSArray detectionResults = new JSArray();
                String templateName = call.getString("template","DetectDocumentBoundaries_Default");
                String className = call.getString("className","com.tonyxlh.capacitor.camera.CameraPreviewPlugin");
                String methodName = call.getString("methodName","getBitmap");
                Class cls = Class.forName(className);
                Method m = cls.getMethod(methodName,null);
                Bitmap bitmap = (Bitmap) m.invoke(null, null);
                if (bitmap != null) {
                    CapturedResult capturedResult = cvr.capture(bitmap,templateName);
                    CapturedResultItem[] results = capturedResult.getItems();
                    if (results != null) {
                        for (CapturedResultItem result:results) {
                            if (result instanceof DetectedQuadResultItem) {
                                detectionResults.put(Utils.getMapFromDetectedQuadResult((DetectedQuadResultItem) result));
                            }
                        }
                    }
                }
                response.put("results",detectionResults);
                call.resolve(response);
            } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException |
                     InvocationTargetException e) {
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
        String source = call.getString("source","");
        String path = call.getString("path","");
        String templateName = call.getString("template","NormalizeDocument_Binary");
        if (path.equals("")) {
            source = source.replaceFirst("data:.*?;base64,","");
        }
        if (cvr != null) {
            try {
                Point[] points = Utils.convertPoints(quad.getJSONArray("points"));
                Quadrilateral quadrilateral = new Quadrilateral();
                quadrilateral.points = points;
                SimplifiedCaptureVisionSettings settings = cvr.getSimplifiedSettings(templateName);
                settings.roi = quadrilateral;
                settings.roiMeasuredInPercentage = false;
                cvr.updateSettings(templateName,settings); //pass the polygon to the capture router
                CapturedResult capturedResult;
                if (path.equals("")) {
                    capturedResult = cvr.capture(Utils.base642Bitmap(source),templateName); //run normalization
                }else{
                    capturedResult = cvr.capture(path,templateName); //run normalization
                }
                NormalizedImageResultItem result = (NormalizedImageResultItem) capturedResult.getItems()[0];
                JSObject response = new JSObject();
                JSObject resultObject = new JSObject();

                if (call.getBoolean("saveToFile",false)) {
                    File dir = getContext().getExternalCacheDir();
                    File file = new File(dir,new Date().getTime()+".jpg");
                    new ImageManager().saveToFile(result.getImageData(),file.getAbsolutePath(),true);
                    resultObject.put("path",file.getAbsolutePath());
                }
                if (call.getBoolean("includeBase64",false)) {
                    Bitmap bm = result.getImageData().toBitmap();
                    resultObject.put("base64",Utils.bitmap2Base64(bm));
                }
                response.put("result",resultObject);
                call.resolve(response);
            }catch (Exception e) {
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }

    @PluginMethod
    public void detectAndNormalize(PluginCall call) {
        String source = call.getString("source","");
        String path = call.getString("path","");
        String templateName = call.getString("template","DetectAndNormalizeDocument_Color");
        if (path.equals("")) {
            source = source.replaceFirst("data:.*?;base64,","");
        }
        if (cvr != null) {
            try {
                CapturedResult capturedResult;
                if (path.equals("")) {
                    capturedResult = cvr.capture(Utils.base642Bitmap(source),templateName); //run normalization
                }else{
                    capturedResult = cvr.capture(path,templateName); //run normalization
                }
                NormalizedImageResultItem result = (NormalizedImageResultItem) capturedResult.getItems()[0];
                JSObject response = new JSObject();
                JSObject resultObject = new JSObject();
                if (call.getBoolean("saveToFile",false)) {
                    File dir = getContext().getExternalCacheDir();
                    File file = new File(dir, new Date().getTime()+".jpg");
                    new ImageManager().saveToFile(result.getImageData(),file.getAbsolutePath(),true);
                    resultObject.put("path",file.getAbsolutePath());
                }
                if (call.getBoolean("includeBase64",false)) {
                    Bitmap bm = result.getImageData().toBitmap();
                    resultObject.put("base64",Utils.bitmap2Base64(bm));
                }
                response.put("result",resultObject);
                call.resolve(response);
            }catch (Exception e) {
                call.reject(e.getMessage());
            }
        }else{
            call.reject("DDN not initialized");
        }
    }

    public static String saveImage(Bitmap bmp, File dir, String fileName) {
        File file = new File(dir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            bmp.compress(Bitmap.CompressFormat.JPEG, 100, fos);
            fos.flush();
            fos.close();
            return file.getAbsolutePath();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }
}
