// 密码正则
export const passwordReg = /^(?=.{6,16}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])+$/;

//合并rb用户，登录密码
export const passwordRegLogin = /(?=.{6,20}$)(?=.*[0-9])(?=.*[a-zA-Z])(?=[\^#$@]*)([a-zA-Z0-9]([\^#$@]*))+$/;

//合并rb用户，登录用户名5-16位数
export const nameregLogin = /^[a-zA-Z0-9]{5,16}$/;

//用户名正则
export const namereg = /^[a-zA-Z0-9]{6,14}$/;

// 手机号正则
export const phoneReg = /^[1-9][0-9]{8}$/;

// // 邮箱遮挡
// export function maskEmail(email) {
//   let result;
//   const emailPrefix = email.split("@")[0];
//   const emailSuffix = email.split("@")[1];
//   const elength = emailPrefix.length;
//   const maskedPrefix = emailPrefix.replace(/./g, "*");
//   const maskLength = Math.floor((elength /  3) * 2);
//   if (elength > 30) {
//     result =
//       emailPrefix.substr(0, 10) +
//       maskedPrefix.substring(10, elength) +
//       "@" +
//       emailSuffix;
//   } else {
//     result =
//       emailPrefix.substr(0, elength - maskLength) +
//       maskedPrefix.substring(elength - maskLength, elength) +
//       "@" +
//       emailSuffix;
//   }

//   return result;
// }

// // 手机遮挡
// export function maskPhone(phone) {
//   const result = phone.substring(0, 3) + "*******" + phone.substring(10, 14);
//   return result
// }
// 邮箱遮挡
export function maskEmail(email) {
    let result;
    const emailPrefix = email.split("@")[0];
    const emailSuffix = email.split("@")[1];
    const elength = emailPrefix.length;
    const maskedPrefix = emailPrefix.replace(/./g, "*");
    const maskLength = Math.floor((elength /  3) * 2);
    if (elength > 30) {
        result =
            emailPrefix.substr(0, 10) +
            maskedPrefix.substring(10, elength) +
            "@" +
            emailSuffix;
    } else {
        result =
            emailPrefix.substr(0, elength - maskLength) +
            maskedPrefix.substring(elength - maskLength, elength) +
            "@" +
            emailSuffix;
    }

    return result;
}

// 手机遮挡
export function maskPhone(phone) {
    // const result = phone.substring(0, 3) + "*******" + phone.substring(10, 14);
    const result = phone.slice(0, 3) + "****" + phone.slice(-4);
    return result
}

// 手机遮挡只显示后4位数
export function maskPhone4(phone) {
    const result = "**********" + phone.substring(7, 14);
    return result
}
