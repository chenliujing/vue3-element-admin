import request from "@/utils/request";

const AUTH_BASE_URL = "/api/Account";
class AuthAPI {
  /** 登录 接口*/
  static login(userName: string, password: string) {
    console.log(userName);
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/AdminLogin?userName=${userName}&&password=${password}`,
      method: "post",
    });
  }

  /** 注销 接口*/
  static logout() {
    return request({
      url: `${AUTH_BASE_URL}/Logout`,
      method: "delete",
    });
  }

  /** 获取验证码 接口*/
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  }
}

export default AuthAPI;

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  userName: string;
  /** 密码 */
  password: string;
  // /** 验证码缓存key */
  // captchaKey: string;
  // /** 验证码 */
  // captchaCode: string;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  token?: string;
  /** 过期时间(单位：毫秒) */
  expires?: number;
  /** 刷新token */
  refreshToken?: string;
  /** token 类型 */
  tokenType?: string;
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}
