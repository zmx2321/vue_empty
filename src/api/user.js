/**
 *  用以请求接口数据
 */

import axios from './axios'

let base = "/api";

/**
 *  登录/注销/修改密码
 */
// 登录
export const login = () => {
    return  axios({
        url: `${base}/admin/login`,
        method: 'get',
    });
};
/* export const login = params => {
    return  axios({
        url: `${base}/login`,
        method: 'post',
        data: params
    });
}; */

// 获取用户
export const getUser = params => {
    return  axios({
        url: `${base}/user`,
        method: 'get',
        params: params
    });
};

// 注销
export const Logout = () => {
    return  axios({
        url: `${base}/user/logout`,
        method: 'post'
    });
};

// 修改密码
export const ModifyPassword = params => {
    return  axios({
        url: `${base}/user/modify`,
        method: 'post',
        data: params
    });
};