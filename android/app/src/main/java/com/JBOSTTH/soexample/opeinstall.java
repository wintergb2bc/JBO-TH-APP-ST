package com.JBOSTTH.soexample;

import android.app.AlertDialog;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
//import com.sh.sdk.shareinstall.ShareInstall;
//import com.sh.sdk.shareinstall.listener.AppGetInstallListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import pro.piwik.sdk.Tracker;
import pro.piwik.sdk.extra.TrackHelper;

public class opeinstall extends ReactContextBaseJavaModule {

    public static String TAG = "";
    private static final String SHORT = "SHORT";
    private static final String LONG = "J";

    private String CODE;

    public void setName(String name) {
        this.CODE = name;
    }

    public opeinstall(ReactApplicationContext reactContext) {
        super(reactContext);

//         ShareInstall.getInstance().getInstallParams(new AppGetInstallListener() {
//             @Override
//             public void onGetInstallFinish(String info) {
//                 // 客户端获取到的参数是json字符串格式
//                 Log.d("ShareInstall", "info = " + info);
// //                AlertDialog td = new AlertDialog.Builder(getCurrentActivity())
// //                        .setMessage("1code="+info)
// //                        .create();
// //
// //                td.show();
//                 try {
//                     JSONObject object = new JSONObject(info);
//                     // 通过该方法拿到设置的渠道值，剩余值为自定义的其他参数
//                     String channel = object.optString("affCode");
//                     // Log.d("ShareInstall", "channel = " + channel);
//                     //彈窗調適
// //                    AlertDialog ad = new AlertDialog.Builder(getCurrentActivity())
// //                            .setMessage("code="+channel)
// //                            .create();
// //
// //                    ad.show();
//                     CODE = channel;
//                 } catch (JSONException e) {
//                     e.printStackTrace();
//                     CODE = "";
//                 }



//             }
//         });


    }

    @ReactMethod
    public void passDictionaryBackToRN(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putString("CODE", this.CODE);
        callback.invoke(map);
    }

    @ReactMethod
    public void getAffCode(Callback callback) {
        if(TAG == null || TAG.equals("")) {
            //TInstall代理码affcode
            TAG = com.JBOSTTH.soexample.MainActivity.Affcodes;
        }
        callback.invoke(TAG);
    }


    @Override
    public String getName() {
        return "opeinstall";
    }

    @ReactMethod

    public void show(String message, int duration) {
        android.widget.Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @Override
    public Map<String, Object> getConstants() {//设置JS可以使用的常量
        Map<String, Object> Constants = new HashMap<>();
        Constants.put(SHORT, "12312321");
        Constants.put(LONG, Toast.LENGTH_LONG);
        return Constants;
    }

    @ReactMethod
    public void getUMMSG(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putString("CODE", MainApplication.umMSG);
        callback.invoke(map);

        MainApplication.umMSG ="";
    }


    //开关vpn
    // @ReactMethod
    // public void closeVPN(String data) {
    //     MainActivity.ISVPN = data;
    // }
    // @ReactMethod
    // public void openVPN(String data) {
    //     MainActivity.ISVPN = data;
    // }
    //创建vpn监听
    // @ReactMethod
    // public void addVPNListen(String data) {
    //     MainActivity.VPNListen = data;
    // }

    private Tracker getTracker() {
        return ((MainApplication) getReactApplicationContext().getApplicationContext()).getTracker();
    }

    //piwki 點擊事件
    @ReactMethod
     public void PiwikTackEvent(String type,String category,String action,String name) {
         if(type.equals("Tarck")) {
              TrackHelper.track().event(category, action).name(name).with(getTracker());
          }

          if(type.equals("menberCode")) {
              getTracker().setUserId(category);
          }

          if(type.equals("APPVER")) {
            TrackHelper.track().visitVariables(4,"AppRealVersion",category).event("UPLOAD VERSION", "touch").with(getTracker());
          }
          
        //Log.e("benjiTTTTTT",SHORT);
        // MainActivity.PiwikTarck = type;
        // MainActivity.PiwikMsg = msg;
        // MainActivity.PiwikAction = action;
        // MainActivity.PiwikName = name;
        //   TrackHelper.track().event("category", "action").path("/main/actionScreen").name("label").value(1000f).with(tracker);
        // Log.e("benjiTTTTTT",msg);
    }

   


}