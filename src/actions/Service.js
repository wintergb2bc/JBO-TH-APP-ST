
import { Alert,Platform} from 'react-native'; 
import { Toast } from 'antd-mobile-rn';
import {
    Actions,
  } from "react-native-router-flux";
/**
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=40000]   单位：毫秒，这里设置默认超时时间为10秒
 * @return 返回Promise
 */
function timeout_fetch(fetch_promise, timeout = 40000) {
    let timeout_fn = null;

    //这是一个可以被reject的promise
    let timeout_promise = new Promise(function(resolve, reject) {
        timeout_fn = function() { 
            resolve('Time Out!!!'); 
        };   
    });  
    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise
    ]);

    setTimeout(function() {
        timeout_fn();
    }, timeout);

    return abortable_promise;
}
 
   
let apiversion1 = 'api-version=1.0&brand=jbo&Platform=' +Platform.OS
let apiversion2 = 'api-version=2.0&brand=jbo&Platform=' +Platform.OS
//window.imJBOkey 區分 主包或 IM體育包
/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */

window.Gologin =true;
  
window.fetchRequest = (url, method, params = '', timeout = 40000, version =1) => {

    let apiversion=version==2?apiversion2:apiversion1

    if(url && url.indexOf('News') != -1 && window.imJBOkey){
        apiversion = apiversion+'&packageName=NET.GB2BC.JBOIM'
    }

	  let header; 
	 if(ApiPort.UserLogin == true){   
				header = {
							"Content-Type": "application/json; charset=utf-8",
					     	"Culture": "th-th", 
							'Authorization':ApiPort.Token 
					};
			}else{
				header = {
							"Content-Type": "application/json; charset=utf-8",
						    "Culture": "th-th"  
					}; 
      } 

    let headerData;
    if (params == '') { //如果网络请求中没有参数
        return new Promise(function(resolve, reject) {
            timeout_fetch(fetch(common_url + url + apiversion, {
                    method: method,
                    headers: header,
                }),timeout).then((response) => headerData = response.json())
                .then((responseData) => {
										 if(responseData.error_details){ 
                                            //  if(responseData.error_details.Code == "AUTH00001"){ 
                                            //     Toast.fail('The RB88 APP is currently not supporting Thailand region  \n ขณะนี้แอพ RB88 ยังไม่เปิดใช้ภาษาไทย',3)   
                                            //       return;
                                            //   }
                                            if (responseData.error_details.Code == "MEM00145") {
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('จำกัดพื้นที่การเข้าถึง',5)
                                                    //Toast.fail('地区访问限制',5)
                                                    Actions.RestrictPage({RestrictType:'IP'})
                                                    return;
                                                }
                                                return
                                            }    
                                         
											if(responseData.error_details.Code == "GEN0005"){
                                                
                                             

												if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('ระบบตรวจพบว่ามีการเข้าระบบซ้ำซ้อน',3)
                                                        // Toast.fail('重复登录,系统检测到您重复登录',3)
                                                        setTimeout(() => { 
                                                            if(window.CloseReLoAccount){
                                                                CloseReLoAccount();
                                                            }
                                                           
                                                            navigateToSceneGlobe()
                                                        
                                                        }, 2000)
                                                    }
                                                } 
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'GEN0006'){
                                                if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('กรุณาเข้าสู่ระบบอีกครั้ง',3)
                                                  //      Toast.fail('请重新登录,访问过期',3)
                                                        navigateToSceneGlobe() 
                                                    }
                                                } 
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'MEM00061'){
                                                Toast.fail('บัญชีของคุณไม่สามารถใช้งานได้ กรุณาติดต่อฝ่ายบริการลูกค้า',2)
                                                //Toast.fail('您的帐号无法使用,请联系在线客服!',2) 
                                                return;
                                            }

                                            if(responseData.error_details.Code == "GEN0002"){   //訪問限制
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('จำกัดพื้นที่การเข้าถึง',5)
                                                    //Toast.fail('地区访问限制',5)
                                                    Actions.RestrictPage({RestrictType:'IP'})
                                                    return;
                                                }
                                             
                                               return;
                                            }


                                            if(responseData.error_details.Code == "GEN0001"){   //系統維護中
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('อยู่ระหว่างการอัปเกรดระบบ กรุณาเข้าระบบภายหลัง',3)
                                                    //Toast.fail('竞博系统正在更新中，请您稍后再尝试登入。',3)
                                                    Actions.RestrictPage({RestrictType:'Maintenance',RetryAfter: responseData.error_details.RetryAfter,LiveChats:responseData.error_details.LiveChats})
                                                    return;
                                                }
                                              return;
                                            }
                                            
                                            if(responseData.error_details.Message != ""){ 
                                                if(url == ApiPort.login) {
                                                    Toast.info(responseData.error_details.Message,3)  
                                                } else {
                                                    Toast.fail(responseData.error_details.Message,3)  
                                                } 
                                            }   
										 }else{
											 resolve(responseData);
										 } 
                })
                .catch((err) => { 
                    reject(err);
                });
        });
    } else { //如果网络请求中有参数
        return new Promise(function(resolve, reject) {
            timeout_fetch(fetch(params != "HomeBanner" ? common_url + url + apiversion : url, {
                    method: method,
                    headers: header,
                    body: JSON.stringify(params) //body参数，通常需要转换成字符串后服务器才能解析
                }),timeout).then((response) => headerData = response.json())
                .then((responseData) => { 
										if(responseData.error_details){
                                            if (responseData.error_details.Code == "MEM00145") {
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('จำกัดพื้นที่การเข้าถึง',3)
                                                   // console.log('地区访问限制');
                                                    
                                                    Actions.RestrictPage({RestrictType:'IP'})
                                                    return;
                                                }
                                                return
  

                                            }

                                            if(responseData.error_details.Code == 'MEM00059'){
                                                if(url == ApiPort.login) {
                                                    Toast.info(responseData.error_details.Message,2)
                                                } else {
                                                    Toast.fail(responseData.error_details.Message,2)
                                                }
                                                return;
                                            }

                                            if(responseData.error_details.Code == 'MEM00061'){ 
                                                Toast.fail('บัญชีของคุณไม่สามารถใช้งานได้ กรุณาติดต่อฝ่ายบริการลูกค้า',2) 
                                                //Toast.fail('您的帐号无法使用,请联系在线客服!',2) 
                                                return;
                                            }
  
                                            if(responseData.error_details.Code == 'GEN0006'){
                                                if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('กรุณาเข้าสู่ระบบอีกครั้ง',3)
                                                        //Toast.fail('请重新登录,访问过期',3)
                                                        navigateToSceneGlobe() 
                                                    }
                                                } 
                                                return;
                                            }
											if(responseData.error_details.Code == "GEN0005"){
												if(ApiPort.UserLogin == true){
                                                    if(Gologin == true){
                                                        Gologin = false;
                                                        Toast.fail('ระบบตรวจพบว่ามีการเข้าระบบซ้ำซ้อน',2)
                                                        // Toast.fail('重复登录,系统检测到您重复登录',2)

                                                        setTimeout(() => { 
                                                            
                                                            if(window.CloseReLoAccount){
                                                                CloseReLoAccount();
                                                            }
                                                            navigateToSceneGlobe()
                                                        
                                                        }, 2000)

                                                       
                                                    }
                                                } 
                                                return;
                                            }

                                            if(responseData.error_details.Code == "GEN0002"){   //訪問限制
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    Toast.fail('จำกัดพื้นที่การเข้าถึง',5)
                                                    //Toast.fail('地区访问限制',5)
                                                    Actions.RestrictPage({RestrictType:'IP'})
                                                    return;
                                                }
                                             
                                               return;
                                            }


                                            if(responseData.error_details.Code == "GEN0001"){   //系統維護中
                                                if(!global.Restrict){
                                                    isGameLock=false
                                                    global.Restrict = true
                                                    ApiPort.UserLogin == false
                                                    
                                                    Toast.fail('อยู่ระหว่างการอัปเกรดระบบ กรุณาเข้าระบบภายหลัง',3)
                                                    // Toast.fail('竞博系统正在更新中，请您稍后再尝试登入。',3)
                                                    Actions.RestrictPage({RestrictType:'Maintenance',RetryAfter: responseData.error_details.RetryAfter,LiveChats:responseData.error_details.LiveChats})
                                                    return;
                                                }
                                              return;
                                            }
                                            
                                            if(responseData.error_details.Message != ""){ 
                                                if(url == ApiPort.login) {
                                                    Toast.info(responseData.error_details.Message,2)  
                                                } else {
                                                    Toast.fail(responseData.error_details.Message,2)  
                                                } 
                                            }   

										}else{
                                           
											resolve(responseData);
										}
                    
                })
                .catch((err) => { 
                    reject(err);
                });
        });
    }
}

