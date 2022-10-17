// STATICS.newdebt_ratio
const SOURCES = {
    WMS: 'WMS',
    CITIES: 'CITIES',
};
const LAYERS = {
    STATE_FILL: 'city-fills',
};

/**
 * 默认配置，带底图
 */
export const glMapConfig = (id, geoData, center, zoom) => {
    return {
        container: id, //容器的id
        style: 'https://demotiles.maplibre.org/style.json', //地图描述数据的路径
        center: center ? center : [120.5, 28.8], // 初始位置，经度纬度 [lng, lat]
        zoom: zoom ? zoom : 6.5, // 初始缩放
        minZoom: 6,
        pitch: 20,  // 倾斜
        antialias: true, //抗锯齿
        style: {
            version: 8,
            sources: {
                [SOURCES.WMS]: {
                    type: 'raster',
                    tiles: [
                        'http://decision.cncico.com/cicomap/wms?' +
                        qs.stringify(
                            {
                                service: 'WMS',
                                version: '1.1.0',
                                request: 'GetMap',
                                layers: 'cicomap:cicomap_group',
                                bbox: '{bbox-epsg-3857}',
                                width: 512,
                                height: 512,
                                srs: 'EPSG:3857',
                                format: 'image/png',
                                TRANSPARENT: 'TRUE',
                            },
                            { encode: false },
                        ),
                    ],
                    tileSize: 256,
                },
                [SOURCES.CITIES]: {
                    type: 'geojson',
                    data: geoData,
                    generateId: true,
                },
            },
            layers: [
                {
                    // 底图
                    id: 'wmsLayer',
                    type: 'raster',
                    source: SOURCES.WMS,
                },
                {
                    id: 'city-shadow',
                    type: 'fill',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'fill-color': '#0239A8',
                        'fill-translate': [5, 10],
                        'fill-translate-anchor': 'viewport',
                    },
                },
                {
                    id: 'city-shadow-light',
                    type: 'line',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'line-color': '#02FDFE',
                        'line-width': 2,
                        'line-translate': [5, 10],
                        'line-translate-anchor': 'viewport',
                    },
                },
                {
                    // 市
                    id: LAYERS.STATE_FILL,
                    type: 'fill',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'fill-color': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            '#26E3F0',
                            '#1151B1',
                        ],
                    },
                },
                {
                    // 市界
                    id: 'city-borders',
                    type: 'line',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'line-color': '#1cccff',
                        'line-width': 0.5,
                        'line-opacity': 0.7,
                    },
                },
            ],
        },
    }
}

/**
 * 不带底图配置
 */
export const glMapConfigSingle = (id, geoData, center, zoom) => {
    return {
        container: id, //容器的id
        // style: 'https://demotiles.maplibre.org/style.json', //地图描述数据的路径
        center: center ? center : [120.5, 28.8], // 初始位置，经度纬度 [lng, lat]
        zoom: zoom ? zoom : 6.5, // 初始缩放
        // minZoom: 6,
        pitch: 20,
        antialias: true, //抗锯齿
        style: {
            version: 8,
            sources: {
                [SOURCES.WMS]: {
                    type: 'raster',
                    /* tiles: [
                        'http://decision.cncico.com/cicomap/wms?' +
                        qs.stringify(
                            {
                                service: 'WMS',
                                version: '1.1.0',
                                request: 'GetMap',
                                layers: 'cicomap:cicomap_group',
                                bbox: '{bbox-epsg-3857}',
                                width: 512,
                                height: 512,
                                srs: 'EPSG:3857',
                                format: 'image/png',
                                TRANSPARENT: 'TRUE',
                            },
                            { encode: false },
                        ),
                    ], */
                    tileSize: 256,
                },
                [SOURCES.CITIES]: {
                    type: 'geojson',
                    data: geoData,
                    generateId: true,
                },
            },
            layers: [
                // {
                //     // 底图
                //     id: 'wmsLayer',
                //     type: 'raster',
                //     source: SOURCES.WMS,
                // },
                {
                    id: 'city-shadow',
                    type: 'fill',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'fill-color': '#0239A8',
                        'fill-translate': [5, 10],
                        'fill-translate-anchor': 'viewport',
                    },
                },
                {
                    id: 'city-shadow-light',
                    type: 'line',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'line-color': '#02FDFE',
                        'line-width': 2,
                        'line-translate': [5, 10],
                        'line-translate-anchor': 'viewport',
                    },
                },
                {
                    // 市
                    id: LAYERS.STATE_FILL,
                    type: 'fill',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'fill-color': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            '#26E3F0',
                            '#1151B1',
                        ],
                    },
                },
                {
                    // 市界
                    id: 'city-borders',
                    type: 'line',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'line-color': '#1cccff',
                        'line-width': 0.5,
                        'line-opacity': 0.7,
                    },
                },
            ],
        },
    }
}

/**
 * 测试
 * 原始配置
 */
export const glMapConfigTest = (id, geoData) => {
    return {
        container: id, //容器的id
        style: 'https://demotiles.maplibre.org/style.json', //地图描述数据的路径
        center: [120.5, 28.8], // 初始位置，经度纬度 [lng, lat]
        zoom: 6.5, // 初始缩放
        minZoom: 6,
        pitch: 20,
        antialias: true, //抗锯齿
        style: {
            version: 8,
            sources: {
                [SOURCES.WMS]: {
                    type: 'raster',
                    tiles: [
                        'http://decision.cncico.com/cicomap/wms?' +
                        qs.stringify(
                            {
                                service: 'WMS',
                                version: '1.1.0',
                                request: 'GetMap',
                                layers: 'cicomap:cicomap_group',
                                bbox: '{bbox-epsg-3857}',
                                width: 512,
                                height: 512,
                                srs: 'EPSG:3857',
                                format: 'image/png',
                                TRANSPARENT: 'TRUE',
                            },
                            { encode: false },
                        ),
                    ],
                    tileSize: 256,
                },
                [SOURCES.CITIES]: {
                    type: 'geojson',
                    data: geoData,
                    generateId: true,
                },
            },
            layers: [
                {
                    // 底图
                    id: 'wmsLayer',
                    type: 'raster',
                    source: SOURCES.WMS,
                },
                {
                    id: 'city-shadow',
                    type: 'fill',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'fill-color': '#0239A8',
                        'fill-translate': [5, 10],
                        'fill-translate-anchor': 'viewport',
                    },
                },
                {
                    id: 'city-shadow-light',
                    type: 'line',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'line-color': '#02FDFE',
                        'line-width': 2,
                        'line-translate': [5, 10],
                        'line-translate-anchor': 'viewport',
                    },
                },
                {
                    // 市
                    id: LAYERS.STATE_FILL,
                    type: 'fill',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'fill-color': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            '#26E3F0',
                            '#1151B1',
                        ],
                    },
                },
                {
                    // 市界
                    id: 'city-borders',
                    type: 'line',
                    source: SOURCES.CITIES,
                    layout: {},
                    paint: {
                        'line-color': '#1cccff',
                        'line-width': 0.5,
                        'line-opacity': 0.7,
                    },
                },
            ],
        },
    }
}