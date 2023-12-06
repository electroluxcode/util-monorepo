"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultData = exports.baseConfig = void 0;
const licenseKeys = {
    qweather: '4f243022fd884f8ea50f842625ec9e4b',
    tianditu: '45842f88be8bdaadff401a6f8c9a1cd2',
    cesiumion: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyM2EzMjhiMC1mOGEyLTRhYjQtYjhjZS0yMjQ5MjljYzY4YmIiLCJpZCI6MTE2MjI0LCJpYXQiOjE2Njk1MjkzMDl9.aNc-57uNs9TANanaWkLdtBocACcrosZiQO-NXmCaARA',
};
exports.baseConfig = {
    //terrainProvider: new Cesium.EllipsoidTerrainProvider({}), //移除自带地形
    // selectionIndicator: false,  // 不显示选择指示器
    // 不显示时间轴
    timeline: false,
    // 不显示左下角圆盘
    animation: false,
    infoBox: false,
    // 不显示home键
    homeButton: false,
    // 去掉原生 选中 entity 后的 绿框
    selectionIndicator: false,
    // requestRenderMode: false, // 启用请求渲染模式，不需要渲染，节约资源吧
    // baseLayerPicker: false, // 如果设置为false，将不会创建右上角图层按钮。
    // navigationHelpButton: false,  // 如果设置为false，则不会创建右上角帮助(问号)按钮。
    // sceneModePicker: false,  // 如果设置为false，将不会创建右上角投影方式控件(显示二三维切换按钮)。
    // geocoder: false,  // 如果设置为false，将不会创建右上角查询(放大镜)按钮。
    // scene3DOnly: true, // 为 true 时，每个几何实例将仅以3D渲染以节省GPU内存。
    //     shouldAnimate:true,
    // 设置地图查看模式为普通的3D视图
    // SCENE2D | SCENE3D | MORPHING
    sceneMode: Cesium.SceneMode.SCENE3D,
    // Cesium使用Bing Maps作为默认的图层。这个图层被打包进Viewer中用于演示。Cesium需要您自己创建ion account然后生成一个access key用于访问图层数据。
    // BingMapsImageryProvider bing 可以用
    // GoogleEarthEnterpriseImageryProvider 可以用
    // SingleTileImageryProvider 单张数据
    // UrlTemplateImageryProvider 高德，腾讯 可以用
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' +
            licenseKeys.tianditu,
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18, // 细节等级18
    }),
};
exports.defaultData = { x: 108, y: 22, z: 10 };
