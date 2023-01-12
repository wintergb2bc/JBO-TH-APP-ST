package com.JBOSTTH.soexample;

import android.app.ActivityManager;
import android.app.Application;
//import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
//import android.content.IntentFilter;
//import android.net.VpnService;
import android.os.Bundle;
//import android.os.Handler;
//import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;




import android.app.AlertDialog;
import java.util.ArrayList;
import java.util.List;
//import java.util.Timer;
//import java.util.TimerTask;

import javax.annotation.Nullable;


import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.modules.core.DeviceEventManagerModule;


import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.MobclickAgent.EScenarioType;
import com.umeng.message.PushAgent;
//import com.umeng.socialize.UMShareAPI;
import com.JBOSTTH.soexample.invokenative.PushModule;

import com.tinstall.tinstall.TInstall;
import org.json.JSONObject;
import org.json.JSONException;


import org.devio.rn.splashscreen.SplashScreen;
//import com.JBOSTTH.soexample.VPNService.DemoService;

import pro.piwik.sdk.Tracker;
import pro.piwik.sdk.extra.TrackHelper;

import static com.E2.eagleeyes.EagleEyes.getBlackBox;
import static com.E2.eagleeyes.EagleEyes.start;

public class MainActivity extends ReactActivity {

    // private static final int VPN_REQUEST_CODE = 0x0F;
    // private static final int PERIOD = 1 * 1000;
    // private static final int DELAY = 1000;
    // private Timer mTimer;
    // private TimerTask mTimerTask;
    // public static String ISVPN = "";
    // public static String VPNCheck = "VPNCheck";
    // public static String isVPNCheck = "isVPNCheck";
    // public static String VPNListen = "";
    public static String PiwikTarck = "";
    public static String PiwikMsg = "";
    public static String PiwikAction = "";
    public static String PiwikName = "";
    public static String Affcodes = "";

    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);

        SplashScreen.show(this);
        // ShareModule.initSocialSDK(this);
        PushModule.initPushSDK(this);
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, EScenarioType.E_DUM_NORMAL);
        MobclickAgent.openActivityDurationTrack(false);
        PushAgent.getInstance(this).onAppStart();PushAgent.getInstance(this).onAppStart();

        //registerReceiver(vpnStateReceiver, new IntentFilter(DemoService.BROADCAST_VPN_STATE));

        // PiwikTarckM();
//        注释不需要vpn
//        startVPN();
//        timeLoop();

        getTinstall();
    }

    private void getTinstall() {
        TInstall.getInstall(this,new TInstall.TInstallCallback() {
            @Override
            public void installBack(JSONObject object) {
                try {
                    Affcodes = object.getString("affCode");
                } catch (JSONException e) {
                    try {
                        Affcodes = object.getString("affcode");
                    } catch (JSONException s) {
                        try {
                            Affcodes = object.getString("aff");
                        } catch (JSONException d) {
                            Affcodes = "err";
                            d.printStackTrace();
                        }
                        s.printStackTrace();
                    }
                    e.printStackTrace();
                }


            }
        });
    }

    ///piwik sdk By benji 1-19 2020 ////
    private Tracker getTracker() {
        return ((MainApplication) getApplication()).getTracker();
    }


    // private void PiwikTarckM() {
    //     Log.e("BenjiU11111","BenjiU1111");
    //     mTimer = new Timer();
    //     mTimerTask = new TimerTask() {
    //         @Override
    //         public void run() {
    //             if(PiwikTarck.equals("Tarck")) {
    //                 Log.e("BenjiUUUU",PiwikTarck);
    //                 // TrackHelper.track().event(PiwikMsg, "touch").with(getTracker());
    //                 TrackHelper.track().event(PiwikMsg, PiwikAction).name(PiwikName).with(getTracker());
    //                 // Log.e("Piwik 1111 Done","BenjiUUUU2222");
    //                 PiwikTarck = "";
    //             }
            
    //             if(PiwikTarck.equals("menberCode")) {
    //                 getTracker().setUserId(PiwikMsg);
    //                 PiwikTarck = "";
    //             }
    //         }
    //     };
    //     mTimer.schedule(mTimerTask,DELAY,PERIOD);
    // }
    ///piwik sdk By benji 1-19 2020 ////
//    }
    //vpn关闭在开启
    // private void isOpenVPN() {
    //     Intent vpnIntent = VpnService.prepare(this);
    //     if (vpnIntent == null)
    //     {
    //         if(VPNCheck.equals("VPNCheck") && VPNListen.equals("VPNListen")) {
    //             //拿到vpn权限
    //             MainApplication.GetReactCommPackage().reactCommModule.sendMsgToRN("VPNCheck");
    //             VPNCheck = "";
    //         }

    //         if(!ISVPN.equals("close")) {
    //             onActivityResult(VPN_REQUEST_CODE, RESULT_OK, null);
    //         }

    //     } else {
    //         //没有拿到vpn权限
    //         if(isVPNCheck.equals("isVPNCheck") && VPNListen.equals("VPNListen")) {
    //             MainApplication.GetReactCommPackage().reactCommModule.sendMsgToRN("isVPNCheck");
    //             isVPNCheck = "";
    //         }
    //     }
    // }


    @Override
    public void onResume() {
        super.onResume();
        //android.util.Log.e("xxxxxx","onResume=");
        MobclickAgent.onResume(this);
    }
    @Override
    protected void onPause() {
        super.onPause();
        //android.util.Log.e("xxxxxx","onPause=");

        MobclickAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // handler.removeCallbacks(runnable);
        // unregisterReceiver(vpnStateReceiver);
        //MobclickAgent.onKillProcess(this);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "UMComponent";
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
        // if (requestCode == VPN_REQUEST_CODE && resultCode == RESULT_OK)
        // {
        //     startService(new Intent(this, DemoService.class));
        // }
    }


    //vpn
    // private Handler handler = new Handler(new Handler.Callback() {
    //     @Override
    //     public boolean handleMessage(Message msg) {
    //         return false;
    //     }
    // });
    // private Runnable runnable = new Runnable() {
    //     @Override
    //     public void run() {

    //         stopService(new Intent(MainActivity.this, DemoService.class));
    //     }
    // };
    // private BroadcastReceiver vpnStateReceiver = new BroadcastReceiver()
    // {
    //     @Override
    //     public void onReceive(Context context, Intent intent)
    //     {
    //         if (DemoService.BROADCAST_VPN_STATE.equals(intent.getAction()))
    //         {
    //             if (intent.getBooleanExtra("running", false))
    //             {
    //             }
    //             else
    //             {
    //                 handler.postDelayed(runnable,200);
    //             }
    //         }
    //     }
    // };

    // private void startVPN()
    // {
    //     Intent vpnIntent = VpnService.prepare(this);
    //     if (vpnIntent != null)
    //     {
    //         startActivityForResult(vpnIntent, VPN_REQUEST_CODE);
    //     }
    //     else
    //     {
    //         onActivityResult(VPN_REQUEST_CODE, RESULT_OK, null);
    //     }
    // }






}
