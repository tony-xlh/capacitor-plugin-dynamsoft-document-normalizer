package com.dynamsoft.capacitor.ddn;

import android.graphics.Bitmap;
import android.graphics.Point;
import android.util.Log;

import com.dynamsoft.core.basic_structures.CapturedResultItem;
import com.dynamsoft.core.basic_structures.Quadrilateral;
import com.dynamsoft.cvr.CaptureVisionRouter;
import com.dynamsoft.cvr.CaptureVisionRouterException;
import com.dynamsoft.cvr.CapturedResult;
import com.dynamsoft.cvr.SimplifiedCaptureVisionSettings;
import com.dynamsoft.ddn.DeskewedImageResultItem;
import com.dynamsoft.ddn.DetectedQuadResultItem;
import com.dynamsoft.license.LicenseManager;
import com.dynamsoft.utility.ImageIO;
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
            cvr = new CaptureVisionRouter();
        }
        call.resolve();
    }

    @PluginMethod
    public void initLicense(PluginCall call) {
        String license = call.getString("license","DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==");
        LicenseManager.initLicense(license, (isSuccess, error) -> {
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
        String templateName = call.getString("template","NormalizeDocument_Default");
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
                DeskewedImageResultItem result = (DeskewedImageResultItem) capturedResult.getItems()[0];
                JSObject response = new JSObject();
                JSObject resultObject = new JSObject();

                if (call.getBoolean("saveToFile",false)) {
                    File dir = getContext().getExternalCacheDir();
                    File file = new File(dir,new Date().getTime()+".jpg");
                    new ImageIO().saveToFile(result.getImageData(),file.getAbsolutePath(),true);
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
        String templateName = call.getString("template","DetectAndNormalizeDocument_Default");
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
                DeskewedImageResultItem result = (DeskewedImageResultItem) capturedResult.getItems()[1];
                JSObject response = new JSObject();
                JSObject resultObject = new JSObject();
                if (call.getBoolean("saveToFile",false)) {
                    File dir = getContext().getExternalCacheDir();
                    File file = new File(dir, new Date().getTime()+".jpg");
                    new ImageIO().saveToFile(result.getImageData(),file.getAbsolutePath(),true);
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
