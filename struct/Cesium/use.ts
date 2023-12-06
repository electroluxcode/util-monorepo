import {cesiumInit} from "./CesiumConfig.js"


let base = new cesiumInit("cesiumContainer")
// base.initObject("gltf","https://cdn.jsdelivr.net/npm/electroluxasset@1.0.8/model/scene/scene.gltf");
base.initObject("example")
// base.initObject("osgb")
document.querySelector(".button_control")?.addEventListener("click",()=>{
    // base.objectMove("gltf","absolute",{x:0,y:0.01,z:0.0})
    // base.cameraMove("relative",{x:0.001,y:0,z:0})
    // base.objectMove("gltf","absolute",{x:0,y:0.01,z:0.0})
})