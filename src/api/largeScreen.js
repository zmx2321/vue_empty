/**
 *  用以请求接口数据
 */

import axios from './axios'

let base = "/api";

// 默认参数
const defaultParams = {
    pageSize: 999,
    // currentPage: 1,
}

/**
 * ******************************************************************************
 * 中间数据接口
 * ******************************************************************************
 */
/**
 * 首页地图上方数据展示
 */
// 首页地图上方数据展示
export const getIndexMapTopData = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/non/oil/above/the/map/data`,
        method: 'get',
        params: defaultParams
    });
};

// 首页地图上方数据展示 - 非油
export const getIndexMapTopFeiData = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/non/oil/above/the/map/data`,
        method: 'get',
        params: defaultParams
    });
};

/* // 本年累计对客营收
export const getBnljdkysData = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/youpin/year/count/revenue`,
        method: 'get',
        params: defaultParams
    });
}; */

// 首页地图上方数据展示1 - 非油
// action_type ---- getServerConnect传这个参数就是今日实时营收数据
// action_type --------getYearRevenue      传参就是年度累计营收  
export const getIndexMapTopData1 = action_type => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/accumulated/revenue/year`,
        method: 'post',
        params: {
            // ...defaultParams,
            ...{
                action_type
            }
        }
    });
};

// 首页地图上方数据展示2 - 高速石油今年营收数据
export const getIndexMapTopData2 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/revenue/data/high/speed/this/year`,
        method: 'post',
    });
};

// 首页地图上方数据展示3 - 高速石油今日实时营收数据
export const getIndexMapTopData3 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/high/speed/real/revenue/today`,
        method: 'post',
    });
};

/**
 * 首页地图上方数据展示 - 需要鉴权 - 需要与2-3相加
 */
// 首页地图上方数据展示2-1 - 高速能源今年营收金额
export const getIndexMapTopData2t1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/high/speed/energy/revenue/year`,
        method: 'post',
    });
};
// 首页地图上方数据展示2-2 - 高速能源今年交易笔数
export const getIndexMapTopData2t2 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/ransactions/speed/energy/this/year`,
        method: 'post',
    });
};
// 首页地图上方数据展示3-1 - 高速能源今日营收金额实时
export const getIndexMapTopData3t1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/Real/time/revenue/highspeed/energy/today`,
        method: 'post',
    });
};
// 首页地图上方数据展示3-2 - 高速能源今日客单量实时笔数
export const getIndexMapTopData3t2 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/high/speed/nergy/realtime/passenger/volume/today`,
        method: 'post',
    });
};

// 首页地图上方数据展示4 - 真实接口
export const getIndexMapTopData4 = () => {
    return axios({
        url: `${base}/sanji/getAmount`,
        method: 'get',
    });
};

/**
 * 首页地图下方数据展示
 */
// 首页地图下方数据展示
export const getIndexMapBelowData = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/year/data/all`,
        method: 'get',
        params: defaultParams
    });
};

// 首页地图下方数据展示1 - 本年光伏发电本年储能
export const getIndexMapBelowData1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/power/generation/energy/storage/year`,
        method: 'get',
        params: defaultParams
    });
};

/**
 * ******************************************************************************
 * 地图、经营指标相关数据
 * ******************************************************************************
 */
// 首页地图数据
export const getIndexMap = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/level/kanban/home/map`,
        method: 'get',
        params: defaultParams
    });
};

// 查看门店/项目简介
export const getBusiness = params => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/data/store/project/introduce`,
        method: 'get',
        params: {
            ...params,
            ...defaultParams
        }
    });
};

/* // 查看门店/项目简介1 - 高速石油今年营收数据
export const getBusiness1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/revenue/data/high/speed/this/year`,
        method: 'post',
    });
};
// 查看门店/项目简介2 - 高速石油今日实时营收数据
export const getBusiness2 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/high/speed/real/revenue/today`,
        method: 'post',
    });
}; */

// 获取项目情况
export const getPojDetail = params => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/data/project/information`,
        method: 'get',
        params: {
            ...params,
            ...defaultParams
        }
    });
};

// 获取公司经营指标
export const getCompanyTarget = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/data/business/indicators`,
        method: 'get',
        params: defaultParams
    });
};

/**
 * ******************************************************************************
 * 左边静态区域接口
 * ******************************************************************************
 */
// 获取经营数据
export const getOperateData = params => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/operating/data`,
        method: 'get',
        params: {
            ...params,
            ...defaultParams
        }
    });
};

// 获取本年投资进度图表
export const getBatteryProcessChart0 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/annual/investment`,
        method: 'get',
        params: defaultParams
    });
};

// 获取会员进度条图表
export const getBatteryProcessChart1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/member/progress/bar`,
        method: 'get',
        params: defaultParams
    });
};

// 获取人力分布 
export const getIndustrialTalent = params => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/manpower/distribution`,
        method: 'get',
        params: {
            ...params,
            ...defaultParams
        }
    });
};

// 获取风险数据图表
export const getRiskDataChart = params => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/risk/data`,
        method: 'get',
        params: {
            ...params,
            ...defaultParams
        }
    });
};

// 获取风险数据
export const getRiskDataInfo = params => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/safety/accident`,
        method: 'get',
        params: {
            ...params,
            ...defaultParams
        }
    });
};

/**
 * 营收与利润
 */
//  营收饼图
export const getYingShouChart1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/revenue/and/profit/structure`,
        method: 'get',
        params: defaultParams
    });
};
//  营收折线
export const getYingShouChart2 = business_id => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/three/year/revenue/data`,
        method: 'get',
        params: {
            ...defaultParams,
            business_id
        }
    });
};
//  利润饼图
export const getLiRunChart1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/profit/pie/chart/structure`,
        method: 'get',
        params: defaultParams
    });
};
//  利润折线
export const getLiRunChart2 = business_id => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/three/year/profit/data`,
        method: 'get',
        params: {
            ...defaultParams,
            business_id
        }
    });
};

/**
 * ******************************************************************************
 * 右边区域接口
 * ******************************************************************************
 */
/**
 * ***********************************************
 * 右边不需要区分
 * ***********************************************
 */
/**
 * 服务区经营数据
 */
// 获取服务门店在营数据(表格)
export const getServiceAreaTable = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/service/area/store/operation/rate`,
        method: 'get',
        params: defaultParams,
    });
};
/**
 * 公共服务数据
 */
// 公共服务支出变动率
export const getPublicServiceData1 = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/operating/data`,
        method: 'get',
        params: defaultParams
    });
}
// 渲染服务区投诉排行表格以及投诉数据
export const getPublicServiceTable = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/service/area/complaint/ranking`,
        method: 'get',
        params: defaultParams
    });
}
// 渲染服务区吸引力图表
export const getPublicServiceChart = () => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/service/area/attractiveness/ranking`,
        method: 'get',
        params: defaultParams
    });
};

/**
 * ***********************************************
 * 右边区分服务区和区域接口
 * ***********************************************
 */
/**
 * 流量数据相关 12个接口
 */
// 点服务区渲染流量数据图表
export const getFlowChartByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/serverpart/vehicleflow/carin/bytype`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域渲染流量数据图表
export const getFlowChartByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/area/vehicleflow/carin/bytype`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示今日入区车辆
export const getFlowData1ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/serverpart/vehicleflow/carin/today`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示今日入区车辆
export const getFlowData1ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/area/vehicleflow/carin/today`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示本年累计入区车辆数
export const getFlowData2ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/serverpart/vehicleflow/carin/year`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示本年累计入区车辆数
export const getFlowData2ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/area/vehicleflow/carin/year`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示今日入区率
export const getFlowData3ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/serverpart/vehicleflow/carin_per/today`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示今日入区率
export const getFlowData3ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/sycloud/area/vehicleflow/carin_per/today`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示今日入区消费转化率
export const getFlowData4ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/area/entrance/conversion/rate/today`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示今日入区消费转化率
export const getFlowData4ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/region/entrance/conversion/rate/today`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示累计入区消费转化率
export const getFlowData5ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/area/entrance/conversion/rate/sum`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示累计入区消费转化率 --- ?
export const getFlowData5ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/region/entrance/conversion/rate/sum`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

/**
 * 服务区经营数据
 */
// 点服务区显示渲染累计对客营收柱状图
export const getServiceAreaChartByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/store/sales/rate/and/consumption/revenue`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示渲染累计对客营收柱状图
export const getServiceAreaChartByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/store/sales/rate/and/consumption/revenue/region`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示今日单笔消费金额
export const getServiceAreaData1ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/area/today/one/money`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};

// 点区域显示今日单笔消费金额
export const getServiceAreaData1ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/regional/single/consumption/amount/today`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

// 点服务区显示管理人员
export const getServiceAreaData2ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/management/personnel/service/area`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};

// 点区域显示管理人员
export const getServiceAreaData2ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/management/personne/Region`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

/**
 * 公共服务数据
 */
// 点服务区显示公共服务数据车位数量
export const getPublicServiceData1ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/spaces/used/service/area`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示公共服务数据车位数量
export const getPublicServiceData1ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/spaces/used/service/area/region`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};

/**
 * 服务区经营数据和公共服务数据重合
 */
// 点服务区显示服务区门店在营率和公共服务数据门店数量
export const getServicePublicData1ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/operating/rate/one`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示服务区门店在营率和公共服务数据门店数量
export const getServicePublicData1ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/operating/rate/region`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};
// 点服务区显示服务区数据和公共数据
export const getServicePublicData2ByService = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/service/area/data/and/public/data`,
        method: 'get',
        params: {
            ...defaultParams,
            serverpart_name: label
        }
    });
};
// 点区域显示服务区数据和公共数据
export const getServicePublicData2ByRegion = label => {
    return axios({
        url: `${base}/zhgs_data_syn/dev/service/area/data/and/public/data/region`,
        method: 'get',
        params: {
            ...defaultParams,
            area: label
        }
    });
};