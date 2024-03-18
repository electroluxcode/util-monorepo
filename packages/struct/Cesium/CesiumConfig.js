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
    tileset = await window.Cesium.Cesium3DTileset.fromUrl(url, option);
    // add 返回的 参数可以 保存
    const TileData = await viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset, new window.Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0));
    //定位过去
    viewer.zoomTo(tileset);
    return TileData;
}
const cesiumToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNWFkMGNlYS0xZjcyLTQ5NDctOGM3Ny02YjE4ZGIxOTRhNjQiLCJpZCI6MTc5OTE1LCJpYXQiOjE3MDA2MzMyMzh9.aQkgp-BpIpBsussmEOgn_Rl14048nNL74Z7aug0matM';
export class cesiumInit {
    container;
    LifeCycle;
    // 当前模型位置
    ModelPosition = [{
            x: null,
            y: null,
            z: null,
        }];
    PositionData = {
        x: null,
        y: null,
        z: null,
    };
    constructor(idName, initData) {
        // 初始化参数
        window.Cesium.Ion.defaultAccessToken = cesiumToken;
        this.LifeCycle = {
            status: 'LOADING',
            onMounted: () => {
                console.log('zptest:模型挂载中');
            },
        };
        if (initData) {
            this.PositionData = initData;
        }
        else {
            this.PositionData = defaultData;
        }
        this.container = new window.Cesium.Viewer(idName, baseConfig);
        this.initScene();
        this.initLight();
        this.clickSearch(this.container);
    }
    /**
     * @feature 模型加载
     * @param type
     */
    async initObject(type, url) {
        this.destroyedAll();
        if (type == 'gltf') {
            await this.InitGltfModel(this.container, url ?? 'http://smartdeliver.oss-cn-beijing.aliyuncs.com/yt300mb.gltf', this.PositionData);
        }
        if (type == "osgb") {
            await InitOsgbModel(this.container, url ?? 'http://8.130.101.131:8088/model/Tile_+000_+001_dist/tileset.json');
        }
        if (type == "example") {
            let sensorsList = [{
                    id: "test_number_001",
                    "longitude": 108.07671,
                    "latitude": 22,
                }];
            sensorsList.forEach((position) => {
                let longitude;
                let latitude;
                let color = window.Cesium.Color.PURPLE;
                longitude = parseFloat(position.longitude);
                latitude = parseFloat(position.latitude);
                const point = window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 50);
                this.container.entities.add({
                    id: position.id,
                    position: point,
                    // 2d 是 point
                    point: new window.Cesium.PointGraphics({
                        show: true,
                        pixelSize: 10,
                        color: color,
                        outlineColor: window.Cesium.Color.WHITE,
                        outlineWidth: 2,
                        clampToGround: true, //设置贴地
                        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //设置贴地
                    }),
                });
                this.container.zoomTo(this.container.entities);
            });
        }
    }
    clickSearch(_viewer) {
        let handler = new window.Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
        handler.setInputAction((event) => {
            let pick = _viewer.scene.pick(event.position);
            if (window.Cesium.defined(pick)) {
                console.log(pick);
            }
        }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    /**
     * @feature feature:控制模型
     */
    // temp1.objectMove("gltf","relative",{x:0,y:300,z:0}，{scale:2,heading:135})
    objectMove(Type, Mode = 'relative', DegreesType = { x: 0.1, y: 0, z: 0 }, config = {
        scale: 1,
        heading: 135,
    }) {
        // http://cesium.xin/cesium/cn/Documentation1.62/Cartesian3.html
        // 坐标什么的随便写了一个
        let destination;
        let nowPos;
        if (Type == '3dtile') {
            const base = this.Cartesian3_to_WGS84(this.container.camera.position);
            destination = window.Cesium.Cartesian3.fromDegrees(base.x + DegreesType.x, base.y + DegreesType.y, base.z + DegreesType.z);
            const temp = window.Cesium.Transforms.headingPitchRollToFixedFrame(destination, new window.Cesium.HeadingPitchRoll(0, 0, 0));
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
                    x: (this.ModelPosition[0].x ?? 10) + DegreesType.x,
                    y: (this.ModelPosition[0].y ?? 10) + DegreesType.y,
                    z: (this.ModelPosition[0].z ?? 10) + DegreesType.z,
                };
            }
            const position = window.Cesium.Cartesian3.fromDegrees(nowPos.x, nowPos.y, nowPos.z);
            this.container.entities.values[0].position = position;
            this.container.entities.values[0].model.scale = config.scale;
            const heading = window.Cesium.Math.toRadians(config.heading);
            const pitch = 0;
            const roll = 0;
            // 指定朝向
            const orientation = window.Cesium.Transforms.headingPitchRollQuaternion(position, new window.Cesium.HeadingPitchRoll(heading, pitch, roll));
            this.container.entities.values[0].orientation = orientation;
            // alert('加载完成');
        }
    }
    /**
     * @des feature:视角的经纬度移动(绝对) | (相对)
     * @param DegreesType x y z
     */
    cameraMove(Mode = 'relative', DegreesType = this.PositionData, config = { heading_toRadians: 0, pitch_toRadians: -45, isTrackModel: true }) {
        let destination;
        if (Mode == 'absolute') {
            this.container.camera.setView({
                destination: window.Cesium.Cartesian3.fromDegrees(DegreesType.x, DegreesType.y, DegreesType.z),
            });
            destination = window.Cesium.Cartesian3.fromDegrees(DegreesType.x, DegreesType.y, DegreesType.z);
        }
        if (Mode == "relative") {
            const base = this.Cartesian3_to_WGS84(this.container.camera.position);
            destination = window.Cesium.Cartesian3.fromDegrees(base.x + DegreesType.x, base.y + DegreesType.y, base.z + DegreesType.z);
        }
        // 缩放
        this.container.camera.flyTo({
            destination,
            orientation: {
                // 方向  default value is 0.0 (north)
                heading: window.Cesium.Math.toRadians(config.heading_toRadians),
                // 俯仰,向下看
                pitch: window.Cesium.Math.toRadians(config.pitch_toRadians),
            },
        });
    }
    lifeCycleChange(arg) {
        this.LifeCycle = arg;
    }
    destroyedAll() {
        this.container.entities.removeAll();
    }
    /**
     * @des -------工具方法世界坐标转经纬度---------
     */
    Cartesian3_to_WGS84(point = { x: 0, y: 0, z: 0 }) {
        const cartesian33 = new window.Cesium.Cartesian3(point.x, point.y, point.z);
        const cartographic = window.Cesium.Cartographic.fromCartesian(cartesian33);
        const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
        const lng = window.Cesium.Math.toDegrees(cartographic.longitude);
        const alt = cartographic.height;
        return { x: lng, y: lat, z: alt };
    }
    async InitGltfModel(viewer, url = 'http://smartdeliver.oss-cn-beijing.aliyuncs.com/yt300mb.gltf', degrees) {
        // 2d 状态
        if (viewer.scene.morphTime === 1) {
            console.log('');
        }
        else {
            return;
        }
        if (!degrees) {
            degrees = this.PositionData;
        }
        const position = window.Cesium.Cartesian3.fromDegrees(degrees.x, degrees.y, degrees.z);
        this.ModelPosition[0] = JSON.parse(JSON.stringify({
            x: degrees.x,
            y: degrees.y,
            z: degrees.z,
        }));
        const heading = window.Cesium.Math.toRadians(135);
        const pitch = 0;
        const roll = 0;
        // 指定朝向
        const orientation = window.Cesium.Transforms.headingPitchRollQuaternion(position, new window.Cesium.HeadingPitchRoll(heading, pitch, roll));
        const entity = await viewer.entities.add({
            id: "FirstBimModel",
            name: url,
            position: position,
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 18,
                maximumScale: 20,
            },
        });
        //获取 id 后删除
        // const box  = viewer.entites.getById("box");
        // viewer.entities.remove(box);
        viewer.zoomTo(entity);
        const helper = new window.Cesium.EventHelper();
        helper.add(viewer.scene.globe.tileLoadProgressEvent, function (event) {
            console.log('每次加载矢量切片都会进入这个回调:', event);
            if (event == 0) {
                console.log('这个是加载最后一个矢量切片的回调');
            }
        });
        // alert("加载到这里了)
        // viewer.trackedEntity = entity;
        return entity;
    }
    async initScene() {
        // this.container.scene.globe.show = false;
        // this.container.scene.globe.baseColor = new window.Cesium.Color(0, 0, 0, 0.1); //设置地球颜色
        // this.container.cesiumWidget.creditContainer.style.display = 'none';
        // window.Cesium.Camera.DEFAULT_VIEW_FACTOR = 0; // 设置矩形框视图的远近缩放，等于0时不缩放，大于0时拉远，小于0时拉近
    }
    initLight() { }
}
