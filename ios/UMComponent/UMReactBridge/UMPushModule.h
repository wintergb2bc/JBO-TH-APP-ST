//
//  PushModule.h
//  UMComponent
//
//  Created by wyq.Cloudayc on 11/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface UMPushModule : NSObject <RCTBridgeModule>
+(void)registerWithAppkey:(NSString *)appkey launchOptions:(NSDictionary *)launchOptions;
+(void)registerDeviceToken:(NSData *)deviceToken;
+(void)didReceiveRemoteNotification:(NSDictionary *)userInfo;
+(void)setAutoAlert:(BOOL)autoAlert;
@end
