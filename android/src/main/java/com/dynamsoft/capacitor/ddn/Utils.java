package com.dynamsoft.capacitor.ddn;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.util.Base64;

import com.dynamsoft.core.Quadrilateral;
import com.dynamsoft.ddn.DetectedQuadResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;

public class Utils {
    public static Bitmap base642Bitmap(String base64) {
        byte[] decode = Base64.decode(base64,Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(decode,0,decode.length);
    }

    public static String bitmap2Base64(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
    }

    public static Point[] convertPoints(JSONArray pointsArray) throws JSONException {
        Point[] points = new Point[4];
        for (int i = 0; i < pointsArray.length(); i++) {
            JSONObject pointMap = pointsArray.getJSONObject(i);
            Point point = new Point();
            point.x = pointMap.getInt("x");
            point.y = pointMap.getInt("y");
            points[i] = point;
        }
        return points;
    }

    public static JSObject getMapFromDetectedQuadResult(DetectedQuadResult result){
        JSObject map = new JSObject ();
        map.put("confidenceAsDocumentBoundary",result.confidenceAsDocumentBoundary);
        map.put("location",getMapFromLocation(result.location));
        return map;
    }

    private static JSObject getMapFromLocation(Quadrilateral location){
        JSObject map = new JSObject();
        JSArray  points = new JSArray();
        for (Point point: location.points) {
            JSObject pointAsMap = new JSObject();
            pointAsMap.put("x",point.x);
            pointAsMap.put("y",point.y);
            points.put(pointAsMap);
        }
        map.put("points",points);
        return map;
    }
}
