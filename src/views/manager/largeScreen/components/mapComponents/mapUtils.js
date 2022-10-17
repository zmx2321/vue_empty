/**
 * 地图相关工具方法
 */
 import maplibregl from 'maplibre-gl';

 import { glMapConfig, glMapConfigSingle, glMapConfigTest } from './mapData/mapConfig'  // config

import zhejiangIndexGeo from './mapData/geoData/zhejiangIndex';  // 首页浙江
import zhejiangGeo from './mapData/geoData/zhejiang';  // 普通浙江
import shanghaiGeo from './mapData/geoData/shanghai';  // 上海
import jiangsuGeo from './mapData/geoData/jiangsu';  // 江苏
import xinjiangGeo from './mapData/geoData/xinjiang';  // 新疆
import guangxiGeo from './mapData/geoData/guangxi';  // 广西
import sichuanGeo from './mapData/geoData/sichuan';  // 四川
import jiangxiGeo from './mapData/geoData/jiangxi';  // 江西

/******************************
 * 地图工具
 * ****************************
 */
// 初始化地图
const mapInitTool = (mapconfig, geoData, center, zoom) => {
    return new maplibregl.Map(mapconfig('glMap', geoData, center, zoom));  // 初始化地图
}
// 渲染geojson
const renderGeo = (geoData, map, className, isSet=false, next) => {
    // console.log(geoData)

    geoData.features.forEach(item=> {
        let { properties } = item
        let { name, centroid } = properties

        if(!centroid) {
            centroid = properties.center
        }

        let el = document.createElement('div');
        el.innerHTML = `<div class="title">${name}</div>`;
        el.className = `city-label ${className}`;

        // 是否需要定制化
        if(isSet) {
            next(el, item, name)
        }

        new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(centroid).addTo(map);
    })
}
// 添加面
const addMapLayer = (map, geoData, idName , color)=> {
    // 添加Source，类型是geojson
    map.addSource(idName, {       
        'type': 'geojson',
        'data': geoData
    });

    map.addLayer({
        'id': idName,
        'type': 'fill',  // fill类型layer
        'source': idName,         
        'layout': {},
        'paint': {
        'fill-color': color,  // fill颜色
        'fill-opacity': 0.8  // fill透明度
        }
    });
}

/******************************
 * 地图供出方法
 * ****************************
 */
/**
 * 地图核心方法供出
 */
// 地图配置
export const setMapConfig = (map)=> {
    // 添加相关的地图控件
    map.addControl(new maplibregl.FullscreenControl(),'top-right'); 

    // this.glMap.addControl(new maplibregl.NavigationControl()); 
    // this.glMap.scrollZoom.disable();  // 禁用地图缩放
}
// 设置标注
export const setMarkerCommon = (el, lonlat, popup, map)=> {
    // 如果map为空，表示三个参数
    if(!map) {
        // 无气泡
        let map = popup
        new maplibregl.Marker(el)
        .setLngLat(lonlat)
        .addTo(map);
    } else {
        // 有气泡
        new maplibregl.Marker(el)
        .setLngLat(lonlat)
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
    }
}
// 设置气泡
export const setPopupCommon = (map, linlat, inner)=> {
    return new maplibregl.Popup({ closeOnClick: true })
    .setLngLat(linlat)
    .setHTML(inner)
    .addTo(map);
}


/**
 * 地图数据及渲染方法供出
 */
/**
 * 首页浙江
 */
// 地图初始化
export const zhejiangMapIndex = () => {
    return mapInitTool(glMapConfigSingle, zhejiangIndexGeo)
}
// 渲染geoData
export const renderGeoToZheJiangIndex = (map, next) => {
    // 定制首页地图geojson
    renderGeo(zhejiangIndexGeo, map, 'zhejiang_index', true, (el, item, name)=> {
        // console.log(el, item, name)

        setTimeout(()=> {
            switch(name) {
                case '浙北':
                    // console.log(name, item)
                    addMapLayer(map, item, 'zhebei', '#1B346A')
                    break
                case '浙南':
                    // console.log(name, item)  // 浙东
                    // addMapLayer(map, item, 'zhenan', '#f00')
                    addMapLayer(map, item, 'zhenan', '#5EB156')
                    break
                case '浙西':
                    // console.log(name, item)  // 浙南
                    // addMapLayer(map, item, 'zhexi', '#f00')
                    addMapLayer(map, item, 'zhexi', '#B55140')
                    break
                case '浙东':
                    // console.log(name, item)  // 浙西
                    // addMapLayer(map, item, 'zhedong', '#f00')
                    addMapLayer(map, item, 'zhedong', '#A0A36B')
                    break
            }
        }, 0)

        // 标注点击事件
        el.addEventListener('click', e=> {
            let { textContent } = e.target
            // console.log(textContent)

            // 获取城市标注数据
            next(textContent)
        })
    })
}

/**
 * 普通浙江
 */
export const zhejiangMap = () => {
    return mapInitTool(glMapConfigSingle, zhejiangGeo)
}
export const renderGeoToZheJiang = map => {
    renderGeo(zhejiangGeo, map, 'zhejiang')
}

/**
 * 上海
 */
export const shanghaiMap = () => {
    // return mapInitTool(glMapConfigSingle, shanghaiGeo, [121.5, 31.1], 8.3)
    return mapInitTool(glMapConfigSingle, shanghaiGeo, [121.4, 31.2], 8.9)
}
export const renderGeoToShangHai = map => {
    renderGeo(shanghaiGeo, map, 'shanghai')
}

/**
 * 江苏
 */
export const jiangsuMap = () => {
    return mapInitTool(glMapConfigSingle, jiangsuGeo, [119.5, 33.1], 6.3)
}
export const renderGeoToJiangSu = map => {
    renderGeo(jiangsuGeo, map, 'jiangsu')
}

/**
 * 新疆
 */
export const xinjiangMap = () => {
    // return mapInitTool(glMapConfigSingle, xinjiangGeo, [85, 41], 4.3)
    return mapInitTool(glMapConfigSingle, xinjiangGeo, [85, 41], 5)
}
export const renderGeoToXingJiang = map => {
    renderGeo(xinjiangGeo, map, 'xinjiang')
}

/**
 * 广西
 */
export const guangxiMap = () => {
    return mapInitTool(glMapConfigSingle, guangxiGeo, [108.3, 23.7], 6)
}
export const renderGeoToGuangXi = map => {
    renderGeo(guangxiGeo, map, 'guangxi')
}

/**
 * 四川
 */
export const sichuanMap = () => {
    return mapInitTool(glMapConfigSingle, sichuanGeo, [103, 30.28], 5.5)
}
export const renderGeoToSichuan = map => {
    renderGeo(sichuanGeo, map, 'sichuan')
}

/**
 * 江西
 */
export const jiangxiMap = () => {
    return mapInitTool(glMapConfigSingle, jiangxiGeo, [116, 26.6], 6)
}
export const renderGeoToJiangXi = map => {
    renderGeo(jiangxiGeo, map, 'sichuan')
}