// @ts-nocheck
import { baseConfig, defaultData } from './BaseConfig.js';
/**
 * @des 瓦片加载
 */
async function InitOsgbModel(viewer, url = '/Tile_+000_+001_dist/tileset.json') {
    viewer.imageryLayers.removeAll();
    let tileset = {};
    const option = {
        skipLevelOfDetail: true,
        dynamicScreenSpaceError: true, // 根据测试，有了这个后，会在真正的全屏加载完之后才清晰化房屋
    };
    tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
    // add 返回的 参数可以 保存
    const TileData = await viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0));
    //定位过去
    viewer.zoomTo(tileset);
    return TileData;
}
/**
 * @des 加载gltf 数据
 */
async function InitGltfModel(viewer, url = 'http://smartdeliver.oss-cn-beijing.aliyuncs.com/yt300mb.gltf', degrees, that) {
    // 2d 状态
    if (viewer.scene.morphTime === 1) {
        console.log('');
    }
    else {
        return;
    }
    if (!degrees) {
        degrees = defaultData;
    }
    const position = Cesium.Cartesian3.fromDegrees(degrees.x, degrees.y, degrees.z);
    that.position = JSON.parse(JSON.stringify({
        x: degrees.x,
        y: degrees.y,
        z: degrees.z,
    }));
    const heading = Cesium.Math.toRadians(135);
    const pitch = 0;
    const roll = 0;
    // 指定朝向
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(heading, pitch, roll));
    const entity = await viewer.entities.add({
        name: url,
        position: position,
        orientation: orientation,
        model: {
            uri: url,
            minimumPixelSize: 18,
            maximumScale: 20,
        },
    });
    viewer.zoomTo(entity);
    // const helper = new Cesium.EventHelper();
    // helper.add(viewer.scene.globe.tileLoadProgressEvent, function (event) {
    //   console.log('每次加载矢量切片都会进入这个回调');
    //   if (event == 0) {
    //     console.log('这个是加载最后一个矢量切片的回调');
    //   }
    // });
    // console.log('这个是加载最后一个矢量切片的回调------');
    // alert("加载到这里了)
    // viewer.trackedEntity = entity;
    return entity;
}
const cesiumToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNWFkMGNlYS0xZjcyLTQ5NDctOGM3Ny02YjE4ZGIxOTRhNjQiLCJpZCI6MTc5OTE1LCJpYXQiOjE3MDA2MzMyMzh9.aQkgp-BpIpBsussmEOgn_Rl14048nNL74Z7aug0matM';
export class cesiumInit {
    container;
    TileData;
    ModelData;
    LifeCycle;
    // 当前模型位置
    position = {
        x: null,
        y: null,
        z: null,
    };
    destroyedArr;
    constructor(idName) {
        // 初始化参数
        Cesium.Ion.defaultAccessToken = cesiumToken;
        this.LifeCycle = {
            status: 'LOADING',
            onMounted: () => {
                console.log('zptest:模型挂载中');
            },
        };
        this.container = new Cesium.Viewer(idName, baseConfig);
        this.destroyedArr = [];
        this.initScene();
        this.initLight();
    }
    lifeCycleChange(arg) {
        this.LifeCycle = arg;
    }
    destroyedAll() {
        this.container.entities.removeAll();
    }
    async initScene() {
        // this.container.scene.globe.show = false;
        // this.container.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0.1); //设置地球颜色
        // this.container.cesiumWidget.creditContainer.style.display = 'none';
        // Cesium.Camera.DEFAULT_VIEW_FACTOR = 0; // 设置矩形框视图的远近缩放，等于0时不缩放，大于0时拉远，小于0时拉近
    }
    initLight() { }
    /**
     * feature:基础方法
     * @param type
     */
    async initObject(type) {
        this.destroyedAll();
        if (type == 'bim') {
            this.ModelData = await InitGltfModel(this.container, 'http://smartdeliver.oss-cn-beijing.aliyuncs.com/yt300mb.gltf', defaultData, this);
            console.log('this.ModelData:', this.ModelData);
        }
        else {
            this.TileData = await InitOsgbModel(this.container, '/myStatic/model/Tile_+000_+001_dist/tileset.json');
        }
    }
    // temp1.objectMove("gltf","absolute",{x:0.003,y:0,z:0},{scale:1,heading:135})
    // temp1.objectMove("gltf","relative",{x:0,y:300,z:0}，{scale:2,heading:135})
    objectMove(Type, Mode = 'relative', DegreesType = { x: 0.1, y: 0, z: 0 }, config = {
        scale: 1,
        heading: 135,
    }) {
        let destination;
        let nowPos;
        if (Type == '3dtile') {
            const base = this.Cartesian3_to_WGS84(this.container.camera.position);
            destination = Cesium.Cartesian3.fromDegrees(base.x + DegreesType.x, base.y + DegreesType.y, base.z + DegreesType.z);
            const temp = Cesium.Transforms.headingPitchRollToFixedFrame(destination, new Cesium.HeadingPitchRoll(0, 0, 0));
            console.log('移动:', this.TileData);
            this.TileData.modelMatrix = temp;
        }
        if (Type == 'gltf') {
            // this.ModelData.model!.scale =
            const model = this.container.entities.values[0].position._value;
            if (Mode == 'relative') {
                nowPos = this.Cartesian3_to_WGS84({
                    x: model.x + DegreesType.x,
                    y: model.y + DegreesType.y,
                    z: model.z + DegreesType.z,
                });
            }
            else if (Mode == 'absolute') {
                nowPos = {
                    x: (this.position.x ?? 10) + DegreesType.x,
                    y: (this.position.y ?? 10) + DegreesType.y,
                    z: (this.position.z ?? 10) + DegreesType.z,
                };
            }
            console.log('nowPos:', nowPos);
            const position = Cesium.Cartesian3.fromDegrees(nowPos.x, nowPos.y, nowPos.z);
            this.container.entities.values[0].position = position;
            this.container.entities.values[0].model.scale = config.scale;
            const heading = Cesium.Math.toRadians(config.heading);
            const pitch = 0;
            const roll = 0;
            // 指定朝向
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(heading, pitch, roll));
            this.container.entities.values[0].orientation = orientation;
            // alert('加载完成');
        }
    }
    /**
     * @des feature:视角的经纬度移动(绝对) | (相对)
     * @param DegreesType x y z
     */
    cameraMove(Mode = 'relative', DegreesType = defaultData, config = { heading_toRadians: 0, pitch_toRadians: -45 }) {
        let destination;
        if (Mode == 'absolute') {
            this.container.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(DegreesType.x, DegreesType.y, DegreesType.z),
            });
            destination = Cesium.Cartesian3.fromDegrees(DegreesType.x, DegreesType.y, DegreesType.z);
        }
        else {
            const base = this.Cartesian3_to_WGS84(this.container.camera.position);
            destination = Cesium.Cartesian3.fromDegrees(base.x + DegreesType.x, base.y + DegreesType.y, base.z + DegreesType.z);
        }
        // 缩放
        this.container.camera.flyTo({
            destination,
            orientation: {
                // 方向  default value is 0.0 (north)
                heading: Cesium.Math.toRadians(config.heading_toRadians),
                // 俯仰,向下看
                pitch: Cesium.Math.toRadians(config.pitch_toRadians),
            },
        });
    }
    /**
     * @des 工具方法世界坐标转经纬度
     */
    Cartesian3_to_WGS84(point = { x: 0, y: 0, z: 0 }) {
        const cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const alt = cartographic.height;
        return { x: lng, y: lat, z: alt };
    }
}
