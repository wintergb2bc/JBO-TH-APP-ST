package com.JBOSTTH.soexample;

import java.util.Arrays;
import java.util.List;

import android.app.ActivityManager;
import android.app.Application;
import android.app.Notification;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Handler;
import android.widget.RemoteViews;
import android.widget.Toast;

import android.app.AlertDialog;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import cl.json.RNSharePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import pro.piwik.sdk.Piwik;
import pro.piwik.sdk.Tracker;
import pro.piwik.sdk.TrackerConfig;
import pro.piwik.sdk.extra.TrackHelper;
import timber.log.Timber;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.MsgConstant;
import com.umeng.message.PushAgent;
import com.umeng.message.UTrack;
import com.umeng.message.UmengMessageHandler;
import com.umeng.message.UmengNotificationClickHandler;
import com.umeng.message.common.UmLog;
import com.umeng.message.entity.UMessage;
import com.umeng.socialize.PlatformConfig;

import com.JBOSTTH.soexample.invokenative.PushApplication;
import com.JBOSTTH.soexample.invokenative.DplusReactPackage;
import com.JBOSTTH.soexample.invokenative.RNUMConfigure;

import com.iovation.mobile.android.FraudForceConfiguration;
import com.iovation.mobile.android.FraudForceManager;

import com.JBOSTTH.soexample.iovation.IovationPackage;

import com.burnweb.rnwebview.RNWebViewPackage;
import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import static com.E2.eagleeyes.EagleEyes.getBlackBox;
//import com.JBOSTTH.soexample.ReactComm.ReactCommPackage;
//import com.sh.sdk.shareinstall.ShareInstall;

import com.tinstall.tinstall.TInstall;

/// UM推送指定開啟頁面
import com.google.gson.Gson;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.support.annotation.Nullable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
//UM推送指定開啟頁面

public class MainApplication extends PushApplication implements ReactApplication {


    private static final String TAG = MainApplication.class.getName();
    //public static final ReactCommPackage reactCommPackage = new ReactCommPackage();
    private Handler handler;

    private static Context context;
    public static String umMSG = "";    //UM指定

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
            new ReactNativeFingerprintScannerPackage(),
            new MainReactPackage(),
            new ImagePickerPackage(),
            new RNSharePackage(),
            new LinearGradientPackage(),
            new SvgPackage(),
            new RNViewShotPackage(),
            new RNDeviceInfo(),
            new SplashScreenReactPackage(),
            new OrientationPackage(),
            new ReactVideoPackage(),
            new IovationPackage(),   //黑合子
            new AnExampleReactPackage(),
            new RNWebViewPackage(),
            //reactCommPackage,

            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG,"https://www.rb1005.com"),
             new DplusReactPackage()
            );
        }


    };


    ///piwik sdk By benji 1-19 2020 ////

    private final String ORIGIN_HOST = "https://analytics.ravelz.com";
    private final String ORIGIN_SITEID = "a794b2e8-3618-4c06-ba6a-0554e042642b";
    public static final String KEY_HOST = "piwik_host";
    public static final String KEY_SITEID = "piwik_siteid";

    //Not Overridden!!!  mPiwikDemoTracker is a new object for that allows change Host and siteId during app works
    private Tracker mPiwikDemoTracker;
    private String host;
    private String siteId;

    @Override
    public TrackerConfig onCreateTrackerConfig() {
        if (host == null || siteId == null) {
            SharedPreferences sharedPreferences = getSharedPreferences(ReactNativeHost.class.getName(), Context.MODE_PRIVATE);
            host = sharedPreferences.getString(KEY_HOST, ORIGIN_HOST);
            siteId = sharedPreferences.getString(KEY_SITEID, ORIGIN_SITEID);
        }
        //Log.d("Benji22222", "getInstall : installData = ");
        return TrackerConfig.createDefault(host, siteId);
    }

    ///piwik sdk By benji 1-19 2020 ////



    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        initPiwik();     ///piwik sdk By benji 1-19 2020 ////
        if (isMainProcess()) {
            //ShareInstall.getInstance().init(getApplicationContext());
        }
        context = getApplicationContext();

        SoLoader.init(this, /* native exopackage */ false);
        UMConfigure.setLogEnabled(true);

        //初始化Tinstall代理码
        TInstall.setHost("https://apifeaffcodegetB.com");
        TInstall.init(this,"2O3TYX");

        //初始化组件化基础库, 统计SDK/推送SDK/分享SDK都必须调用此初始化接口
        RNUMConfigure.init(this, "60e7cf2072748106e47a67a7", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
            "fb2478767016a5ce6a2755ce3352e615");
        initUpush();

        FraudForceManager Configuration;
        FraudForceConfiguration fraudForceConfiguration = new FraudForceConfiguration.Builder()
                .enableNetworkCalls(true)
                .subscriberKey("720702")
                .build();

        FraudForceManager fraudForceManager = FraudForceManager.getInstance();



    }


    ///piwik sdk By benji 1-19 2020 ////



    private void initPiwik() {
        // Print debug output when working on an app.
        Timber.plant(new Timber.DebugTree());
        TrackHelper.track().screens(this).with(getTracker());
    }

    @Override
    public void onLowMemory() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.ICE_CREAM_SANDWICH && mPiwikDemoTracker != null) {
            mPiwikDemoTracker.dispatch();
        }
        super.onLowMemory();
    }

    @Override
    public void onTrimMemory(int level) {
        if ((level == TRIM_MEMORY_UI_HIDDEN || level == TRIM_MEMORY_COMPLETE) && mPiwikDemoTracker != null) {
            mPiwikDemoTracker.dispatch();
        }
        super.onTrimMemory(level);
    }

    //Not Overridden!!! mPiwikDemoTracker is a new object for that allows change Host and siteId during app works
    public synchronized Tracker getTracker() {
        if (mPiwikDemoTracker == null) getNewTracker();
        return mPiwikDemoTracker;
    }

    public synchronized Tracker getNewTracker() {
        mPiwikDemoTracker = getPiwik().newTracker(onCreateTrackerConfig());
        return mPiwikDemoTracker;
    }

    public Piwik getPiwik() {
        return Piwik.getInstance(this);
    }
    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
        getSharedPreferences(MainApplication.class.getName(), Context.MODE_PRIVATE).edit().putString(KEY_HOST, host).commit();
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
        getSharedPreferences(MainApplication.class.getName(), Context.MODE_PRIVATE).edit().putString(KEY_SITEID, siteId).commit();
    }


    ///piwik sdk By benji 1-19 2020 ////

    public static Context getContext() {
        return context;
    }




    public boolean isMainProcess() {

        int pid = android.os.Process.myPid();
        ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningAppProcessInfo appProcess : activityManager.getRunningAppProcesses()) {
            if (appProcess.pid == pid) {
                return getApplicationInfo().packageName.equals(appProcess.processName);
            }
        }
        return false;
    }


    //定义发送事件的函数
    public  void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params)
    {
        System.out.println("reactContext="+reactContext);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName,params);
    }

    private void initUpush() {
        handler = new Handler(getMainLooper());

        //友盟 push
        PushAgent mPushAgent = PushAgent.getInstance(this);

        UmengMessageHandler messageHandler = new UmengMessageHandler() {

            /**
             * 通知的回调方法（通知送达时会回调）
             */
            @Override
            public void dealWithNotificationMessage(Context context, UMessage msg) {
                //调用super，会展示通知，不调用super，则不展示通知。
                super.dealWithNotificationMessage(context, msg);
                Gson gson = new Gson();
                // 推送的内容
                Log.i("msg来了内容", msg.text);
                Log.i("msg来了头", msg.title);

                String jsonStr = gson.toJson(msg);
                umMSG = jsonStr;
                Log.i("完整输出", jsonStr);

            }

        };


        mPushAgent.setDisplayNotificationNumber(10);
        mPushAgent.setMessageHandler(messageHandler);

        //注册推送服务，每次调用register方法都会回调该接口
        mPushAgent.register(new IUmengRegisterCallback() {

            @Override
            public void onSuccess(String deviceToken) {
                //注册成功会返回device token
                //  Log.i(deviceToken,"deviceToken来了");
                //Log.i(deviceToken,deviceToken);
            }

            @Override
            public void onFailure(String s, String s1) {
                // Log.i(s,s);
                // Log.i(s1,s1);
            }



            /**
             * 程序是否在前台运行
             *
             * @return
             */
            public boolean isAppOnForeground() {
                // Returns a list of application processes that are running on the
                // device

                ActivityManager activityManager = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
                String packageName = getApplicationContext().getPackageName();

                List<RunningAppProcessInfo> appProcesses = activityManager
                        .getRunningAppProcesses();
                if (appProcesses == null)
                    return false;

                for (RunningAppProcessInfo appProcess : appProcesses) {
                    // The name of the process that this object is associated with.
                    if (appProcess.processName.equals(packageName)
                            && appProcess.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                        return true;
                    }
                }

                return false;
            }

        });

        ////////////////////////////////////////////


    }

    // public static ReactCommPackage GetReactCommPackage(){
    //     return reactCommPackage;
    // }


    {

//        PlatformConfig.setWeixin("wxdc1e388c3822c80b", "3baf1193c85774b3fd9d18447d76cab0");
//        //豆瓣RENREN平台目前只能在服务器端配置
//        PlatformConfig.setSinaWeibo("3921700954", "04b48b094faeb16683c32669824ebdad", "http://sns.whalecloud.com");
//        PlatformConfig.setYixin("yxc0614e80c9304c11b0391514d09f13bf");
//        PlatformConfig.setQQZone("100424468", "c7394704798a158208a74ab60104f0ba");

    }
}
