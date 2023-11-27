/**
 *  用以请求接口数据
 */

import axios from './axios'

let base = "/api";

/**
 * ******************************************************************************
 * 接口
 * ******************************************************************************
 */
export const getData = () => {
    return axios({
        url: `${base}/xxxx/data`,
        method: 'get',
        // params: defaultParams
    });
};
